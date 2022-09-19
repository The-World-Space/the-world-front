import {
    Color,
    CssHtmlElementRenderer,
    CssSpriteAtlasRenderer,
    CssTextRenderer,
    FontWeight,
    GameObject,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    SpriteAtlasAnimator,
    TextAlign,
    ZaxisSorter} from "the-world-engine";
import { Quaternion, Vector2, Vector3 } from "three/src/Three";

import { MovementAnimationController } from "../script/controller/MovementAnimationController";
import { PlayerStatusRenderController } from "../script/controller/PlayerStatusRenderController";

export class BasePlayerPrefab extends Prefab {
    private _spriteAtlasPath = new PrefabRef<string>("/assets/charactor/Seongwon.png");
    private _nameTagString = new PrefabRef<string>();

    public with4x4SpriteAtlasFromPath(name: PrefabRef<string>): this {
        this._spriteAtlasPath = name;
        return this;
    }

    public withNameTag(name: PrefabRef<string>): this {
        this._nameTagString = name;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantiater = this.instantiater;

        const chatboxRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
        const chatboxObject: PrefabRef<GameObject> = new PrefabRef();
        const nameTagRenderer: PrefabRef<CssTextRenderer> = new PrefabRef();
        const nameTagObject: PrefabRef<GameObject> = new PrefabRef();

        return this.gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.viewScale = 1;
                if (this._spriteAtlasPath.ref) {
                    c.asyncSetImageFromPath(this._spriteAtlasPath.ref, 4, 4, (): void => {
                        c.imageWidth *= 0.6;
                        c.imageHeight *= 0.6;
                    });
                }
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
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => {
                c.runOnce = false;
                c.offset = 0.1;
            })
            .withComponent(PlayerStatusRenderController, c => {
                c.setChatBoxObject(chatboxObject.ref!);
                c.setChatBoxRenderer(chatboxRenderer.ref!);
                c.setNameTagObject(nameTagObject.ref!);
                c.setNameTagRenderer(nameTagRenderer.ref!);
                c.nameTag = this._nameTagString.ref;
            })

            .withChild(instantiater.buildGameObject("chatbox",
                new Vector3(0, 2.8, 100000),
                new Quaternion(),
                new Vector3().setScalar(0.3))
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

            .withChild(instantiater.buildGameObject("nametag",
                new Vector3(0, 2, 100000),
                new Quaternion(),
                new Vector3().setScalar(0.3))
                .active(false)
                .withComponent(CssTextRenderer, c => {
                    c.textAlign = TextAlign.Center;
                    c.fontWeight = FontWeight.Bold;
                    c.textColor = new Color(0, 0, 0);
                    c.textHeight = 1;
                    c.textWidth = 8;
                    c.fontFamily = "Noto Sans";
                    c.pointerEvents = false;
                })
                .getComponent(CssTextRenderer, nameTagRenderer)
                .getGameObject(nameTagObject));
    }
}
