import { CssTilemapRenderer, TileAtlasItem } from "../component/render/CssTilemapRenderer";
import { GameObjectBuilder } from "../engine/hierarchyObject/GameObject";
import { Prefab } from "../engine/hierarchyObject/Prefab";

export class TestTilemapPrefab extends Prefab {

    public make(): GameObjectBuilder {
        const instantlater = this._gameManager.instantlater;

        return this._gameObjectBuilder
            .withChild(instantlater.buildGameObject("floor")
                .withComponent(CssTilemapRenderer, c => {
                    c.rowCount = 18;
                    c.columnCount = 17;

                    const tilemap3 = new Image();
                    tilemap3.src = `${process.env.PUBLIC_URL}/assets/tilemap/3_tile.png`;

                    tilemap3.onload = () => {
                        c.imageSources = [new TileAtlasItem(tilemap3, 10, 10)];

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
                    c.rowCount = 18;
                    c.columnCount = 17;

                    const tilemap3 = new Image();
                    tilemap3.src = `${process.env.PUBLIC_URL}/assets/tilemap/3_tile.png`;

                    tilemap3.onload = () => {
                        c.imageSources = [new TileAtlasItem(tilemap3, 10, 10)];

                        const V = {i:0, a:25};
                        const W = {i:0, a:36};
                        const X = {i:0, a:31};
                        const Y = {i:0, a:27};
                        const Z = {i:0, a:32};

                        const A = {i:0, a:21};
                        const B = {i:0, a:22};
                        const C = {i:0, a:23};
                        const D = {i:0, a:24};

                        const o = null;

                        c.drawTileFromTwoDimensionalArray([
                            
                            [o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o],
                            [o, V, V, A, B, A, B, o, A, B, A, B, A, B, V, V, o],
                            [o, V, V, C, D, C, D, X, C, D, C, D, C, D, V, V, o],
                            [o, W, W, W, W, W, W, Y, W, W, W, W, W, W, W, W, o],
                            [o, o, o, o, o, o, o, Z, o, o, o, o, o, o, o, o, o],
                        ], 0, 0);
                    }
                }));
    }
}