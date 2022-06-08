import { Quaternion, Vector2, Vector3 } from "three";
import {
    CssSpriteAtlasRenderer,
    SpriteAtlasAnimator,
    ZaxisSorter,
    GameObject,
    GameObjectBuilder,
    Prefab,
    CssTextRenderer,
    FontWeight,
    TextAlign,
    CssHtmlElementRenderer,
    PrefabRef,
    IGridCollidable
} from "the-world-engine";
import { MovementAnimationController } from "../script/controller/MovementAnimationController";
import { PlayerStatusRenderController } from "../script/controller/PlayerStatusRenderController";
import { NpcGridMovementController } from "../script/controller/NpcGridMovementController";
import { NpcController } from "../script/controller/NpcController";

export class NpcPlayerPrefab extends Prefab {
    private _spriteAtlasPath: PrefabRef<string> = new PrefabRef("/assets/charactor/Seongwon.png");
    private _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private _gridPosition: PrefabRef<Vector2> = new PrefabRef();
    private _nameTagString: PrefabRef<string> = new PrefabRef();

    public with4x4SpriteAtlasFromPath(name: PrefabRef<string>): NpcPlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withCollideMap(colideMap: PrefabRef<IGridCollidable>): NpcPlayerPrefab {
        this._collideMaps.push(colideMap);
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): NpcPlayerPrefab {
        this._gridPosition = gridPosition;
        return this;
    }

    public withNameTag(name: PrefabRef<string>): NpcPlayerPrefab {
        this._nameTagString = name;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this.engine.instantiater;
        
        const chatboxRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
        const chatboxObject: PrefabRef<GameObject> = new PrefabRef();
        const nameTagRenderer: PrefabRef<CssTextRenderer> = new PrefabRef();
        const nameTagObject: PrefabRef<GameObject> = new PrefabRef();
        
        return this.gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                if (this._spriteAtlasPath.ref) c.asyncSetImage(this._spriteAtlasPath.ref, 4, 4);
                c.centerOffset = new Vector2(0, 0.4);
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
                c.frameDuration = 0.1;
            })
            .withComponent(NpcGridMovementController, c => {
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
                c.speed = 160;
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

            .withComponent(NpcController)

            .withChild(instantlater.buildGameObject("chatbox",
                new Vector3(0, 45, 0),
                new Quaternion(),
                new Vector3(0.5, 0.5, 0.5))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    const chatboxDiv = document.createElement("div");
                    chatboxDiv.style.borderRadius = "15px";
                    chatboxDiv.style.background = "#000000";
                    chatboxDiv.style.color = "#ffffff";
                    chatboxDiv.style.textAlign = "center";
                    chatboxDiv.style.padding = "5px 10px";
                    chatboxDiv.style.opacity = "0.5";
                    chatboxDiv.style.fontFamily = "Noto Sans";
                    c.element = chatboxDiv;
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
                    c.fontFamily = "Noto Sans";
                    c.pointerEvents = false;
                })
                .getComponent(CssTextRenderer, nameTagRenderer)
                .getGameObject(nameTagObject));
    }
}
