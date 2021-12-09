import { Vector2, Vector3 } from "three";
import { CssCollideTilemapChunkRenderer } from "../component/physics/CssCollideTilemapChunkRenderer";
import { CssTilemapChunkRenderer } from "../component/post_render/CssTilemapChunkRenderer";
import { ParallaxTranslater } from "../component/post_render/ParallaxTranslater";
import { CameraRelativeZaxisSorter } from "../component/render/CameraRelativeZaxisSorter";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { CssSpriteRenderer } from "../component/render/CssSpriteRenderer";
import { TileAtlasItem } from "../component/render/CssTilemapRenderer";
import { IframeRenderer } from "../component/render/IframeRenderer";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder, } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";

export class SansFightRoomPrefab extends Prefab {
    private _colideTilemapChunkRenderer: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();

    public getColideTilemapChunkRendererRef(colideTilemapRenderer: PrefabRef<CssCollideTilemapChunkRenderer>): SansFightRoomPrefab {
        this._colideTilemapChunkRenderer = colideTilemapRenderer;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this._gameManager.instantlater;

        return this._gameObjectBuilder
            .withChild(instantlater.buildGameObject("tilemap")
                .withComponent(CameraRelativeZaxisSorter, c => c.offset = -500)

                .withChild(instantlater.buildGameObject("floor")
                    .withComponent(CssTilemapChunkRenderer, c => {
                        const tilemap3 = new Image();
                        tilemap3.src = "/assets/tilemap/room_sanscorridor.png";

                        c.imageSources = [new TileAtlasItem(tilemap3, 3, 20)];
                        c.pointerEvents = false;
                        
                        tilemap3.onload = () => {
                            tilemap3.onload = null;
                            const F = {i:0, a:57};
                            const G = {i:0, a:58};
                            const H = {i:0, a:48};
                            const I = {i:0, a:49};
                            const J = {i:0, a:52};
                            const K = {i:0, a:53};
                            c.drawTileFromTwoDimensionalArray([
                                [G, F, G, F, G, F, G, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, G, F, G, F, G, F, G, F],
                                [F, G, F, G, F, G, F, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, F, G, F, G, F, G, F, G],
                                [G, F, G, F, G, F, G, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, G, F, G, F, G, F, G, F],
                                [F, G, F, G, F, G, F, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, F, G, F, G, F, G, F, G],
                            ], -2, -2);
                        }
                    }))

                .withChild(instantlater.buildGameObject("wall")
                    .withComponent(CssCollideTilemapChunkRenderer, c => {
                        const tilemap3 = new Image();
                        tilemap3.src = "/assets/tilemap/room_sanscorridor.png";

                        c.imageSources = [
                            new TileAtlasItem(tilemap3, 3, 20)
                        ];
                        c.pointerEvents = false;

                        tilemap3.onload = () => {
                            tilemap3.onload = null;

                            const W = {i:0, a:56};
                            const X = {i:0, a:50};
                            const Y = {i:0, a:59};
                            const Z = {i:0, a:40};
                            const A = {i:0, a:51};
                            const o = null;
                            c.drawTileFromTwoDimensionalArray([
                                [W, W, W, W, W, W, W, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, W, W, W, W, W, W, W, W,],
                                [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
                                [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
                                [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
                                [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
                                [Y, Y, Y, Y, Y, Y, Y, Y, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, W, W, W, W, W, W, W, W,],
                            ], -2, 2);

                            const B = {i:0, a:44};
                            const C = {i:0, a:42};
                            c.drawTileFromTwoDimensionalArray([
                                [o, o, o, o, o, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C]
                            ], -2, 7);

                            c.addCollider(-3, 1);
                            c.addCollider(-3, 0);
                            c.addCollider(-3, -1);
                            c.addCollider(-3, -2);
                            for (let i = -4; i < 58; i++) {
                                c.addCollider(i, -3);
                            }
                            c.addCollider(58, 1);
                            c.addCollider(58, 0);
                            c.addCollider(58, -1);
                            c.addCollider(58, -2);

                            [
                                {x: 5, y: 1},
                                {x: 11, y: 1},
                                {x: 17, y: 1},
                                {x: 23, y: 1},
                                {x: 29, y: 1},
                                {x: 35, y: 1},
                                {x: 41, y: 1},
                                {x: 47, y: 1},
                            ].forEach(p => {
                                c.drawTileFromTwoDimensionalArray([
                                    [{i: 0, a: 0}, {i: 0, a: 1}, {i: 0, a: 2}],
                                    [{i: 0, a: 3}, {i: 0, a: 4}, {i: 0, a: 5}],
                                    [{i: 0, a: 6}, {i: 0, a: 7}, {i: 0, a: 8}],
                                    [{i: 0, a: 9}, {i: 0, a: 10}, {i: 0, a: 11}],
                                    [{i: 0, a: 12}, {i: 0, a: 13}, {i: 0, a: 14}],
                                    [{i: 0, a: 15}, {i: 0, a: 16}, {i: 0, a: 17}],
                                ], p.x, p.y);
                            });

                            [
                                {x: 8, y: 3},
                                {x: 14, y: 3},
                                {x: 20, y: 3},
                                {x: 26, y: 3},
                                {x: 32, y: 3},
                                {x: 38, y: 3},
                                {x: 44, y: 3},
                            ].forEach(p => {
                                c.drawTileFromTwoDimensionalArray([
                                    [{i: 0, a: 24}, {i: 0, a: 25}, {i: 0, a: 26}],
                                    [{i: 0, a: 27}, {i: 0, a: 28}, {i: 0, a: 29}],
                                    [{i: 0, a: 30}, {i: 0, a: 31}, {i: 0, a: 32}],
                                    [{i: 0, a: 33}, {i: 0, a: 34}, {i: 0, a: 35}],
                                    [{i: 0, a: 36}, {i: 0, a: 37}, {i: 0, a: 38}],
                                ], p.x, p.y);
                            });
                        }
                    })
                    .getComponent(CssCollideTilemapChunkRenderer, this._colideTilemapChunkRenderer ?? new PrefabRef())))

            .withChild(instantlater.buildGameObject("objects")

                .withChild(instantlater.buildGameObject("iframe", new Vector3(8 + 16 * 46, 8, 0))
                    .withComponent(IframeRenderer, c => {
                        c.iframeSource = "https://jcw87.github.io/c2-sans-fight/";
                        c.width = 64 * 3;
                        c.height = 36 * 3;
                        c.viewScale = 0.1;
                        c.iframeCenterOffset = new Vector2(0, 0.5);
                    })
                    .withComponent(ZaxisSorter))

                .withChild(instantlater.buildGameObject("sans", new Vector3(8 + 16 * 39, 8 + 16 * -1, 0))
                    .withComponent(CssSpriteAtlasRenderer, c => {
                        c.setImage("/assets/charactor/Sans black.png", 4, 4);
                        c.imageCenterOffset = new Vector2(0, 0.4);
                        c.pointerEvents = false;
                        c.imageIndex = 12;
                        c.imageWidth = 16;
                        c.imageHeight = 22;
                    })
                    .withComponent(ZaxisSorter))

                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 5, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 11, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 17, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 23, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 29, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 35, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 41, 16 * -2, 0))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60))
                    
                .withChild(instantlater.buildGameObject("pillar", new Vector3(8 + 16 * 47, 16 * -2, 0))
                    .active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = "/assets/object/spr_foregroundpillar.png";
                        c.imageCenterOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 16 * 3.5;
                        c.imageHeight = 16 * 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -60)));
    }
}
