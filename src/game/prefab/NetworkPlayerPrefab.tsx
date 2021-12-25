import { Quaternion, Vector2, Vector3 } from "three";
import { CssSpriteAtlasRenderer } from "../script/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../script/post_render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../script/render/ZaxisSorter";
import { GameObject, GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { NetworkGridMovementController } from "../script/controller/NetworkGridMovementController";
import { CssTextRenderer, FontWeight, TextAlign } from "../script/render/CssTextRenderer";
import { CssHtmlElementRenderer } from "../script/render/CssHtmlElementRenderer";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { IGridCollidable } from "../script/physics/IGridCollidable";
import { Networker } from "../script/Networker";
import { MovementAnimationController } from "../script/controller/MovementAnimationController";
import { PlayerStatusRenderController } from "../script/controller/PlayerStatusRenderController";

export class NetworkPlayerPrefab extends Prefab {
    private _spriteAtlasPath: PrefabRef<string> = new PrefabRef("/assets/charactor/Seongwon.png");
    private _tilemap: PrefabRef<IGridCollidable> = new PrefabRef();
    private _gridPosition: PrefabRef<Vector2> = new PrefabRef();
    private _nameTagString: PrefabRef<string> = new PrefabRef();

    private _networkManager: Networker | null = null;
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

    public withNetworkManager(networkManager: Networker): NetworkPlayerPrefab {
        this._networkManager = networkManager;
        return this;
    }

    public withUserId(userId: string): NetworkPlayerPrefab {
        this._userId = userId;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this.engine.instantlater;
        
        const chatboxRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
        const chatboxObject: PrefabRef<GameObject> = new PrefabRef();
        const nameTagRenderer: PrefabRef<CssTextRenderer> = new PrefabRef();
        const nameTagObject: PrefabRef<GameObject> = new PrefabRef();
        
        return this.gameObjectBuilder
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
                    c.gridCellWidth = this._tilemap.ref.gridCellWidth;
                    c.gridCenter = this._tilemap.ref.gridCenter;
                }
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                if (this._networkManager && this._userId)
                    c.initNetwork(this._userId, this._networkManager);
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => {
                c.runOnce = false;
                c.offset = 1;
            })
            .withComponent(PlayerStatusRenderController, c => {
                c.setChatBoxObject(chatboxObject.ref!);
                c.setChatBoxRenderer(chatboxRenderer.ref!);
                c.setNameTagObject(nameTagObject.ref!);
                c.setNameTagRenderer(nameTagRenderer.ref!);
                c.nameTag = this._nameTagString.ref;
            })

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
                            chat content
                        </div>
                    );
                    c.pointerEvents = false;
                })
                .getComponent(CssHtmlElementRenderer, chatboxRenderer)
                .getGameObject(chatboxObject))
                
            .withChild(instantlater.buildGameObject("nametag",
                new Vector3(0, 32, 0),
                new Quaternion(),
                new Vector3(0.5, 0.5, 0.5))
                .active(false)
                .withComponent(CssTextRenderer, c => {
                    c.textAlign = TextAlign.Center;
                    c.fontWeight = FontWeight.Bold;
                    c.textHeight = 16;
                    c.textWidth = 128;
                    c.pointerEvents = false;
                })
                .getComponent(CssTextRenderer, nameTagRenderer)
                .getGameObject(nameTagObject));
    }
}
