import { Vector2 } from "three";
import { MovementAnimationController } from "../component/controller/MovementAnimationController";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../component/post_render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { NetworkGridMovementController } from "../component/controller/NetworkGridMovementController";
import { CssCollideTilemapRenderer } from "../component/physics/CssCollideTilemapRenderer";
import { CssCollideTilemapChunkRenderer } from "../component/physics/CssCollideTilemapChunkRenderer";
import { CssTilemapRenderer } from "../component/render/CssTilemapRenderer";
import { CssTilemapChunkRenderer } from "../component/post_render/CssTilemapChunkRenderer";

export class NetworkPlayerPrefab extends Prefab {
    private _spriteAtlasPath: string = `${process.env.PUBLIC_URL}/assets/charactor/Seongwon.png`;
    private _tilemap: CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer|CssTilemapRenderer|CssTilemapChunkRenderer|null = null;
    private _gridPosition: Vector2|null = null;

    public with4x4SpriteAtlasFromPath(name: string): NetworkPlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public withGridInfo(tilemap: CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer|CssTilemapRenderer|CssTilemapChunkRenderer): NetworkPlayerPrefab {
        this._tilemap = tilemap;
        return this;
    }

    public withGridPosition(x: number, y: number): NetworkPlayerPrefab {
        this._gridPosition = new Vector2(x, y);
        return this;
    }

    public make(): GameObjectBuilder {
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
            })
            .withComponent(NetworkGridMovementController, c => {
                if (this._tilemap) {
                    c.gridCellHeight = this._tilemap.tileHeight;
                    c.gridCellWidth = this._tilemap.tileWidth
                    c.gridCenter = this._tilemap.gridCenter;
                }
                if (this._gridPosition) c.initPosition = this._gridPosition;
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => c.runOnce = false);
    }
}
