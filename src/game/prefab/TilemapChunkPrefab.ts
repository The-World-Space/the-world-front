import { CssCollideTilemapChunkRenderer } from "../script/physics/CssCollideTilemapChunkRenderer";
import { CssTilemapChunkRenderer } from "../script/post_render/CssTilemapChunkRenderer";
import { CameraRelativeZaxisSorter } from "../script/render/CameraRelativeZaxisSorter";
import { TileAtlasItem } from "../script/render/CssTilemapRenderer";
import { GameObjectBuilder, } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";

export class TilemapChunkPrefab extends Prefab {
    private _colideTilemapChunkRenderer: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();

    public getColideTilemapChunkRendererRef(colideTilemapRenderer: PrefabRef<CssCollideTilemapChunkRenderer>): TilemapChunkPrefab {
        this._colideTilemapChunkRenderer = colideTilemapRenderer;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this.engine.instantlater;

        return this.gameObjectBuilder
            .withComponent(CameraRelativeZaxisSorter, c => c.offset = -500)
            .withChild(instantlater.buildGameObject("floor")
                .withComponent(CssTilemapChunkRenderer, c => {
                    const tilemap3 = new Image();
                    tilemap3.src = "/assets/tilemap/3_tile.png";

                    c.imageSources = [new TileAtlasItem(tilemap3, 10, 10)];
                    c.pointerEvents = false;
                    
                    tilemap3.onload = () => {
                        tilemap3.onload = null;
                        const F = {i:0, a:44};
                        const o = null;

                        c.drawTileFromTwoDimensionalArray([
                            [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
                            [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
                            [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
                            [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
                            [o, F, F, F, F, F, F, o, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, o],
                            [o, F, o, o, o, o, o, o, o, o, o, o, o, o, o, F, o],
                            [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
                        ], -8, -9);
                    }
                }))
            .withChild(instantlater.buildGameObject("wall")
                .withComponent(CssCollideTilemapChunkRenderer, c => {
                    const tilemap3 = new Image();
                    tilemap3.src = "/assets/tilemap/3_tile.png";

                    const tilemap4 = new Image();
                    tilemap4.src = "/assets/tilemap/4_tile.png";

                    c.imageSources = [
                        new TileAtlasItem(tilemap3, 10, 10),
                        new TileAtlasItem(tilemap4, 10, 15),
                    ];
                    c.pointerEvents = false;

                    tilemap3.onload = () => {
                        tilemap3.onload = null;
                        tilemap4.onload = () => {
                            tilemap4.onload = null;
                            const V = {i:0, a:25};
                            const W = {i:0, a:36};
                            const X = {i:0, a:31};
                            const Y = {i:0, a:27};
                            const Z = {i:0, a:32};

                            const A = {i:0, a:21};
                            const B = {i:0, a:22};
                            const C = {i:0, a:23};
                            const D = {i:0, a:24};

                            const E = {i:1, a:57};
                            const F = {i:1, a:61};
                            const G = {i:1, a:31};
                            const H = {i:1, a:34};
                            const I = {i:1, a:35};
                            const J = {i:1, a:55};
                            const K = {i:1, a:53};
                            const L = {i:1, a:32};
                            const M = {i:1, a:33};
                            const N = {i:1, a:51};
                            const P = {i:1, a:52};
                            const Q = {i:1, a:50};

                            const o = null;

                            c.drawTileFromTwoDimensionalArray([
                                [H, E, E, E, E, E, E, G, E, E, E, E, E, E, E, E, I],
                                [J, V, V, A, B, A, B, F, A, B, A, B, A, B, V, V, K],
                                [J, V, V, C, D, C, D, X, C, D, C, D, C, D, V, V, K],
                                [J, W, W, W, W, W, W, Y, W, W, W, W, W, W, W, W, K],
                                [J, o, o, o, o, o, o, Z, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, K],
                                [J, o, Q, N, N, N, N, N, N, N, N, N, N, N, P, o, K],
                                [L, N, M, o, o, o, o, o, o, o, o, o, o, o, L, N, M],
                            ], -8, -9);
                        }
                    }
                })
                .getComponent(CssCollideTilemapChunkRenderer, this._colideTilemapChunkRenderer ?? new PrefabRef()));
    }
}
