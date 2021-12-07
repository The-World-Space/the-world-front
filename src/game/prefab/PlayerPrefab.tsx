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
import { IGridCollidable } from "../component/physics/IGridCollidable";
import { GridPointer } from "../component/input/GridPointer";
import { PrefabRef } from "../engine/PrefabRef";

export class PlayerPrefab extends Prefab {
    private _spriteAtlasPath: string = `/assets/charactor/Seongwon.png`;
    private _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private _gridPosition: PrefabRef<Vector2> = new PrefabRef();
    private _nameTagString: PrefabRef<string> = new PrefabRef();
    private _gridPointer: PrefabRef<GridPointer> = new PrefabRef();

    public with4x4SpriteAtlasFromPath(name: string): PlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withCollideMap(colideMap: PrefabRef<IGridCollidable>): PlayerPrefab {
        this._collideMaps.push(colideMap);
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
        const instantlater = this._gameManager.instantlater;

        this._gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.setImage(this._spriteAtlasPath, 4, 4);
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
                    c.pointerEvents = false;
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
                        if (this._nameTagString) c.text = this._nameTagString.ref;
                        c.pointerEvents = false;
                    }))
        }

        return this._gameObjectBuilder;
    }
}
