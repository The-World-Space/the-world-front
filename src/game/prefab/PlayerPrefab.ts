import { Vector2 } from "three";
import { MovementAnimationController } from "../component/controller/MovementAnimationController";
import { PlayerGridMovementController } from "../component/controller/PlayerGridMovementController";
import { CssCollideTilemapChunkRenderer } from "../component/physics/CssCollideTilemapChunkRenderer";
import { CssCollideTilemapRenderer } from "../component/physics/CssCollideTilemapRenderer";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../component/render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";

export class PlayerPrefab extends Prefab {
    private _spriteAtlasPath: string = `${process.env.PUBLIC_URL}/assets/charactor/Subject1.png`;
    private _colideTilemap: CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer|null = null;

    public with4x4SpriteAtlasFromPath(name: string): PlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withColideTilemap(colideTilemap: CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer): PlayerPrefab {
        this._colideTilemap = colideTilemap;
        return this;
    }

    public make(): GameObjectBuilder {
        //const instantlater = this._gameManager.instantlater;

        return this._gameObjectBuilder
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
                //charactorAnimator = c;
            })
            .withComponent(PlayerGridMovementController, c => {
                c.collideTilemap = this._colideTilemap;
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => c.runOnce = false);
    }
}
