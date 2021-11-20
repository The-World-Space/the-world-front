import { Renderer, UNFLAT_RENDER_PRIORITY } from "../../core/Renderer/Renderer";
import { Direction, Point } from "../../core/types/Base";
import { Human } from "../character/Human";
import {
    ApolloClient,
    gql
} from "@apollo/client";
import { World } from "../../core/World/World";
import { ImageShape } from "../../core/types/Shape/ImageShape";
import { NameTagger } from "../character/NameTager";



interface User {
    id: string;
    nickname: string;
}

interface UserData {
    user: User;
    character: Human; 
    currentMoving: Direction | null;
    currentMovingTimeout: ReturnType<typeof setTimeout> | null;
}



function hyeonJongFactory() {
    const character = new Human(
        new ImageShape({
            width: 1,
            height: 2,
        }, 'https://e7.pngegg.com/pngimages/517/871/png-clipart-8-bit-super-mario-illustration-super-mario-bros-new-super-mario-bros-video-game-sprite-angle-super-mario-bros.png'),
        {
            walking: ['top.gif', 'bottom.gif', 'left.gif', 'right.gif'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
            standing: ['tile008.png', 'tile000.png', 'tile012.png', 'tile004.png'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
        }
    );
    return character;
}




export class NetworkController {
    private _characterMap: Map<string, UserData>;
    private _world: World;
    private _worldId: string;
    private _playerId: string;
    private _playerCharacter: Human;
    private _renderer: Renderer;
    private _nameTagger: NameTagger;
    private _client!: ApolloClient<any>;

    public afterMove: (controler: NetworkController) => void = _ => { };

    constructor(renderer: Renderer, world: World, character: Human, worldId: string, playerId: string, apolloClient: ApolloClient<any>) {
        this._world = world;
        this._worldId = worldId;
        this._characterMap = new Map();
        this._playerId = playerId;
        this._renderer = renderer;
        this._playerCharacter = character;
        this._nameTagger = new NameTagger(this._renderer);

        this._client = apolloClient;
        this._initApolloClient();
    }

    private _initApolloClient() {
        this._client.subscribe({
            query: gql`
                subscription PLAYER_LIST_UPDATE($worldId: String!) {
                    playerList(worldId: $worldId) {
                        x
                        y
                        user {
                            id
                            nickname
                        }
                    }
                }
            `,
            variables: {
                worldId: this._worldId,
            }
        }).subscribe((data) => {
            data.data.playerList && this.onPlayerListUpdate(data.data.playerList);
        })

        this._client.subscribe({
            query: gql`
                subscription CHARACTER_MOVE($worldId: String!) {
                    characterMove(worldId: $worldId) {
                        x
                        y
                        userId
                    }
                }
            `,
            variables: {
                worldId: this._worldId
            },
        }).subscribe((data) => {
            if (data.data.characterMove) {
                const user = this._characterMap.get(data.data?.characterMove?.userId);
                user && this.moveCharacter(data.data.characterMove, user);
            }
        });

        
    }

    private onPlayerListUpdate(data: {x: number, y: number, user: User}[]) {
        const playerList = data;
        const newPlayers = playerList.filter(p => !this._characterMap.has(p.user.id));
        const leftPlayers = [...this._characterMap.keys()].filter(p => !playerList.find(p2 => p2.user.id === p));

        newPlayers.forEach(p => {
            const user = {
                user: p.user,
                character: hyeonJongFactory(),
                currentMoving: null,
                currentMovingTimeout: null
            };
            
            user.character.setPosition({x: p.x, y: p.y});
            this.joinUser(user);
        });

        leftPlayers.forEach(p => {
            const user = this._characterMap.get(p);

            user && this.leaveUser(user);
        });
    }


    private moveCharacter(nextPos: Point, user: UserData) {
        if (this._playerId === user.user.id) return;

        const move = (nextPos: Point, user: UserData) => {
            user.character.setPosition(nextPos);
            user.currentMoving = Direction.down;
            this._renderer.updateUnflatOne(user.character, UNFLAT_RENDER_PRIORITY.CHARACTER);
            this._nameTagger.moveNameTag(user.character);

            this.afterMove(this);

            user.currentMovingTimeout = setTimeout(() => {
                user.currentMoving = null;
                if (user.currentMovingTimeout !== null) clearTimeout(user.currentMovingTimeout);
                user.character.stop();
                setTimeout(() => this._renderer.updateUnflatOne(user.character, UNFLAT_RENDER_PRIORITY.CHARACTER), 0);
            }, 100);
        };


        const beforePos = user.character.getPosition();
        const going = this._going(beforePos, nextPos);

        if (going) {
            user.character.walk(going);
            if (user.currentMoving) {
                if (user.currentMoving !== going) {
                    user.currentMoving = going;
                }
            } else {
                move(nextPos, user);
            }
        }
    }


    private joinUser(user: UserData) {
        if (this._playerId === user.user.id) return;

        this._characterMap.set(user.user.id, user);
        this._world.addCharacter(user.character);
        this._renderer.drawUnflatObject(user.character, UNFLAT_RENDER_PRIORITY.CHARACTER);
        this._nameTagger.addNameTag(user.character, user.user.nickname);
    }

    private leaveUser(user: UserData) {
        this._characterMap.delete(user.user.id);
        this._renderer.removeOne(user.character);
        this._world.removeCharacter(user.character);
        this._nameTagger.removeNameTag(user.character);
    }

    // private _onKeyUp(event: KeyboardEvent) {
    //     const going = this._going(event);

    //     if (this._currentMoving && going) {
    //         if (going === this._currentMoving) {
    //             this._currentMoving = null;
    //             if (this._currentMovingTimeout !== null) clearTimeout(this._currentMovingTimeout);
    //             // this._characterMap.stop()
    //             // setTimeout(() => this._renderer.updateOne(this._characterMap), 0);
    //         }
    //     }
    // }

    private _going(beforePoint: Point, afterPoint: Point) {
        const dx = afterPoint.x - beforePoint.x;
        const dy = afterPoint.y - beforePoint.y;
        
        let going = null;

        if      (dx < 0) going = Direction.left;
        else if (dx > 0) going = Direction.right;
        else if (dy < 0) going = Direction.up;
        else if (dy > 0) going = Direction.down;

        return going;
    }


}