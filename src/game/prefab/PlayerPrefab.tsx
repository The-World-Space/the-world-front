import { Quaternion, Vector2, Vector3 } from "three";
import { MovementAnimationController } from "../component/controller/MovementAnimationController";
import { PlayerGridMovementController } from "../component/controller/PlayerGridMovementController";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../component/post_render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObject, GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { CssTextRenderer, FontWeight, TextAlign } from "../component/render/CssTextRenderer";
import { CssHtmlElementRenderer } from "../component/render/CssHtmlElementRenderer";
import { IGridCollidable } from "../component/physics/IGridCollidable";
import { GridPointer } from "../component/input/GridPointer";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { PlayerStatusRenderController } from "../component/controller/PlayerStatusRenderController";
import { PlayerGridEventInvoker } from "../component/event/PlayerGridEventInvoker";
import { GridEventMap } from "../component/event/GridEventMap";

export class PlayerPrefab extends Prefab {
    private _spriteAtlasPath: PrefabRef<string> = new PrefabRef("/assets/charactor/Seongwon.png");
    private _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private _gridEventMaps: PrefabRef<GridEventMap>[] = [];
    private _gridPosition: PrefabRef<Vector2> = new PrefabRef();
    private _nameTagString: PrefabRef<string> = new PrefabRef();
    private _gridPointer: PrefabRef<GridPointer> = new PrefabRef();

    public with4x4SpriteAtlasFromPath(name: PrefabRef<string>): PlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withCollideMap(colideMap: PrefabRef<IGridCollidable>): PlayerPrefab {
        this._collideMaps.push(colideMap);
        return this;
    }

    public withGridEventMap(gridEventMap: PrefabRef<GridEventMap>): PlayerPrefab {
        this._gridEventMaps.push(gridEventMap);
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): PlayerPrefab {
        this._gridPosition = gridPosition;
        return this;
    }

    public withNameTag(name: PrefabRef<string>): PlayerPrefab {
        this._nameTagString = name;
        return this;
    }

    public withPathfindPointer(gridPointer: PrefabRef<GridPointer>): PlayerPrefab {
        this._gridPointer = gridPointer;
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
            .withComponent(PlayerGridMovementController, c => {
                if (1 <= this._collideMaps.length) {
                    if (this._collideMaps[0].ref) {
                        c.setGridInfoFromCollideMap(this._collideMaps[0].ref);
                    }
                }

                for (let i = 0; i < this._collideMaps.length; i++) {
                    if (this._collideMaps[i].ref) {
                        c.addCollideMap(this._collideMaps[i].ref!);
                    }
                }
                
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                if (this._gridPointer) c.gridPointer = this._gridPointer.ref;
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
            .withComponent(PlayerGridEventInvoker, c => {
                for (let i = 0; i < this._gridEventMaps.length; i++) {
                    if (this._gridEventMaps[i].ref) {
                        c.addGridEventMap(this._gridEventMaps[i].ref!);
                    }
                }
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
                    c.textWidth = 64;
                    c.pointerEvents = false;
                })
                .getComponent(CssTextRenderer, nameTagRenderer)
                .getGameObject(nameTagObject));
    }
}
