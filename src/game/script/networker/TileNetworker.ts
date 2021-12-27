import { ApolloClient, gql } from "@apollo/client";
import { DumbTypedEmitter } from "detail-typed-emitter";
import { Server } from "../../connect/types";


type DEETypes = {
    "create" : (collider: Server.AtlasTile) => void,
    "delete" : (x: number, y: number, type: number) => void,
}


export class TileNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    constructor(private readonly _worldId: string,
                private readonly _client: ApolloClient<any>) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this._initNetwork();
        // this._initEEListenters();
    }

    private _initNetwork() {
        this._client.subscribe({
            query: gql`
                subscription atlasTileCreating($worldId: String!) {
                    atlasTileCreating(worldId: $worldId) {
                        x
                        y
                        type
                        atlasIndex
                        atlas {
                            id
                            name
                            columnCount
                            rowCount
                            src
                        }
                    }
                }
            `,
            variables: {
                worldId: this._worldId,
            }
        }).subscribe(data => {
            if (!data.data.atlasTileCreating) throw new Error("data.data.atlasTileCreating is falsy");
            const tile = data.data.atlasTileCreating as Server.AtlasTile;
            
            this._dee.emit("create", tile);
        });

        this._client.subscribe({
            query: gql`
                subscription atlasTileDeleting($worldId: String!) {
                    atlasTileDeleting(worldId: $worldId) {
                        x
                        y
                        type
                    }
                }
            `,
            variables: {
                worldId: this._worldId,
            }
        }).subscribe(data => {
            if (!data.data.atlasTileDeleting) throw new Error("data.data.atlasTileDeleting is falsy");
            const tile = data.data.atlasTileDeleting as Server.AtlasTile;

            this._dee.emit("delete", tile.x, tile.y, tile.type);
        });
    }


    // private _initEEListenters() {
        
        
    // }


    get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}

