import { Quaternion, Vector2, Vector3 } from "three";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../component/post_render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { NetworkGridMovementController } from "../component/controller/NetworkGridMovementController";
import { CssTextRenderer, FontWeight, TextAlign } from "../component/render/CssTextRenderer";
import { CssHtmlElementRenderer } from "../component/render/CssHtmlElementRenderer";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { IGridCollidable } from "../component/physics/IGridCollidable";
import { NetworkManager } from "../engine/NetworkManager";
import { MovementAnimationController } from "../component/controller/MovementAnimationController";

export class NetworkPlayerPrefab extends Prefab {
    private _spriteAtlasPath: PrefabRef<string> = new PrefabRef("/assets/charactor/Seongwon.png");
    private _tilemap: PrefabRef<IGridCollidable> = new PrefabRef();
    private _gridPosition: PrefabRef<Vector2> = new PrefabRef();
    private _nameTagString: PrefabRef<string> = new PrefabRef();

    private _networkManager: NetworkManager | null = null;
    private _userId: string | null = null;

    public with4x4SpriteAtlasFromPath(name: PrefabRef<string>): NetworkPlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withGridInfo(tilemap: PrefabRef<IGridCollidable>): NetworkPlayerPrefab {
        this._tilemap = tilemap;
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): NetworkPlayerPrefab {
        this._gridPosition = gridPosition;
        return this;
    }

    public withNameTag(name: PrefabRef<string>): NetworkPlayerPrefab {
        this._nameTagString = name;
        return this;
    }

    public withNetworkManager(networkManager: NetworkManager): NetworkPlayerPrefab {
        this._networkManager = networkManager;
        return this;
    }

    public withUserId(userId: string) {
        this._userId = userId;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this.engine.instantlater;
        
        this.gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                if (this._spriteAtlasPath.ref) c.setImage(this._spriteAtlasPath.ref, 4, 4);
                c.imageCenterOffset = new Vector2(0, 0.4);
                c.pointerEvents = false;
            })
            .withComponent(SpriteAtlasAnimator, c => {
                c.addAnimation("down_idle", [0]);
                c.addAnimation("right_idle", [4]);
                c.addAnimation("up_idle", [8]);
                c.addAnimation("left_idle", [12]);
                c.addAnimation("down_walk", [0, 1, 2, 3]);
                c.addAnimation("right_walk", [4, 5, 6, 7]);
                c.addAnimation("up_walk", [8, 9, 10, 11]);
                c.addAnimation("left_walk", [12, 13, 14, 15]);
                c.frameDuration = 0.2;
            })
            .withComponent(NetworkGridMovementController, c => {
                if (this._tilemap.ref) {
                    c.gridCellHeight = this._tilemap.ref.gridCellHeight;
                    c.gridCellWidth = this._tilemap.ref.gridCellWidth
                    c.gridCenter = this._tilemap.ref.gridCenter;
                }
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                if (this._networkManager && this._userId)
                    c.initNetwork(this._userId, this._networkManager);
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => c.runOnce = false)

            .withChild(instantlater.buildGameObject("chatbox",
                new Vector3(0, 45, 0),
                new Quaternion(),
                new Vector3(0.5, 0.5, 0.5))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    c.setElementFromJSX(
                        <div style={{
                            borderRadius: "15px",
                            background: "#000000",
                            color: "#ffffff", 
                            textAlign: "center",
                            padding: "5px 10px",
                            opacity: 0.5,
                            }}>
                            i'm still busy
                        </div>
                    );
                    c.pointerEvents = false;
                }));
        
        if (this._nameTagString.ref) {
            this.gameObjectBuilder
                .withChild(instantlater.buildGameObject("nametag",
                    new Vector3(0, 32, 0),
                    new Quaternion(),
                    new Vector3(0.5, 0.5, 0.5))
                    .withComponent(CssTextRenderer, c => {
                        c.textAlign = TextAlign.Center;
                        c.fontWeight = FontWeight.Bold;
                        c.textHeight = 16;
                        c.textWidth = 64;
                        if (this._nameTagString.ref) c.text = this._nameTagString.ref;
                        c.pointerEvents = false;
                    }))
        }

        return this.gameObjectBuilder;
    }
}
