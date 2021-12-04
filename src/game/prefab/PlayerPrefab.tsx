import { Quaternion, Vector2, Vector3 } from "three";
import { MovementAnimationController } from "../component/controller/MovementAnimationController";
import { PlayerGridMovementController } from "../component/controller/PlayerGridMovementController";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../component/post_render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { CssTextRenderer, FontWeight, TextAlign } from "../component/render/CssTextRenderer";
import { CssHtmlElementRenderer } from "../component/render/CssHtmlElementRenderer";
import { IGridColideable } from "../component/physics/IGridColideable";

export class PlayerPrefab extends Prefab {
    private _spriteAtlasPath: string = `/assets/charactor/Seongwon.png`;
    private _collideMaps: IGridColideable[] = [];
    private _gridPosition: Vector2|null = null;
    private _nameTagString: string|null = null;

    public with4x4SpriteAtlasFromPath(name: string): PlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withCollideMap(colideMap: IGridColideable): PlayerPrefab {
        this._collideMaps.push(colideMap);
        return this;
    }

    public withGridPosition(x: number, y: number): PlayerPrefab {
        this._gridPosition = new Vector2(x, y);
        return this;
    }

    public withNameTag(name: string): PlayerPrefab {
        this._nameTagString = name;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this._gameManager.instantlater;

        this._gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.setImage(this._spriteAtlasPath, 4, 4);
                c.imageCenterOffset = new Vector2(0, 0.4);
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
                    c.setGridInfoFromCollideMap(this._collideMaps[0]);
                }

                for (let i = 0; i < this._collideMaps.length; i++) {
                    c.addCollideMap(this._collideMaps[i]);
                }
                
                if (this._gridPosition) c.initPosition = this._gridPosition;
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => c.runOnce = false)

            .withChild(instantlater.buildGameObject("chatbox",
                new Vector3(0, 45, 0),
                new Quaternion(),
                new Vector3(0.5, 0.5, 0.5))
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
                            gimme some iphone
                        </div>
                    );
                }));

        if (this._nameTagString) {
            this._gameObjectBuilder
                .withChild(instantlater.buildGameObject("nametag",
                    new Vector3(0, 32, 0),
                    new Quaternion(),
                    new Vector3(0.5, 0.5, 0.5))
                    .withComponent(CssTextRenderer, c => {
                        c.textAlign = TextAlign.Center;
                        c.fontWeight = FontWeight.Bold;
                        c.textHeight = 16;
                        c.textWidth = 64;
                        c.text = this._nameTagString;
                    }))
        }

        return this._gameObjectBuilder;
    }
}
