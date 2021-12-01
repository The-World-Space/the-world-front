import { CssTilemapChunkRenderer } from "../component/render/CssTilemapChunkRenderer";
import { TileAtlasItem } from "../component/render/CssTilemapRenderer";
import { GameObjectBuilder } from "../engine/hierarchyObject/GameObject";
import { Prefab } from "../engine/hierarchyObject/Prefab";

export class TestTilemapChunkPrefab extends Prefab {
    public make(): GameObjectBuilder {
        return this._gameObjectBuilder
            .withComponent(CssTilemapChunkRenderer, c => {
                const tilemap3 = new Image();
                tilemap3.src = `${process.env.PUBLIC_URL}/assets/tilemap/3_tile.png`;
                
                const minecraftTile = new Image();
                minecraftTile.src = `${process.env.PUBLIC_URL}/assets/tilemap/minecraft custom atlas.png`;

                tilemap3.onload = () => {
                    minecraftTile.onload = () => {
                        c.imageSources = [
                            new TileAtlasItem(tilemap3, 10, 10),
                            new TileAtlasItem(minecraftTile, 13, 9)
                        ];
                        for (let i = -40; i < 40; i++) {
                            for (let j = -40; j < 40; j++) {
                                const random = Math.random() > 0.5;
                                const random2 = Math.floor(Math.random() * 100);
                                if (random) c.drawTile(i, j, 1, random2);
                            }
                        }
                    }
                }
            })
    }
}
