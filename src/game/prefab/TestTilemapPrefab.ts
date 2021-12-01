import { CssTilemapRenderer, TileAtlasItem } from "../component/render/CssTilemapRenderer";
import { GameObjectBuilder } from "../engine/hierarchyObject/GameObject";
import { Prefab } from "../engine/hierarchyObject/Prefab";

export class TestTilemapPrefab extends Prefab {

    public make(): GameObjectBuilder {
        const instantlater = this._gameManager.instantlater;

        return this._gameObjectBuilder
            .withChild(instantlater.buildGameObject("floor")
                .withComponent(CssTilemapRenderer, c => {
                    c.rowCount = 16;
                    c.columnCount = 17;

                    const tilemap3 = new Image();
                    tilemap3.src = `${process.env.PUBLIC_URL}/assets/tilemap/3_tile.png`;

                    c.imageSources = [new TileAtlasItem(tilemap3, 10, 10)];
                    
                    tilemap3.onload = () => {
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
                        ], 0, 0);
                    }
                }))
            .withChild(instantlater.buildGameObject("wall")
                .withComponent(CssTilemapRenderer, c => {
                    c.rowCount = 16;
                    c.columnCount = 17;

                    const tilemap3 = new Image();
                    tilemap3.src = `${process.env.PUBLIC_URL}/assets/tilemap/3_tile.png`;

                    const tilemap4 = new Image();
                    tilemap4.src = `${process.env.PUBLIC_URL}/assets/tilemap/4_tile.png`;

                    c.imageSources = [
                        new TileAtlasItem(tilemap3, 10, 10),
                        new TileAtlasItem(tilemap4, 15, 10),
                    ];

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
                            ], 0, 0);
                        }
                    }
                }));
    }
}