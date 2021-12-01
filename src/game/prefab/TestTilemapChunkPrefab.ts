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
                
                tilemap3.onload = () => {
                    c.imageSources = [new TileAtlasItem(tilemap3, 10, 10)];
                    c.drawTile(0, 0, 0, 0);
                    // for (let i = -10; i < 10; i++) {
                    //     for (let j = -10; j < 10; j++) {
                    //         c.drawTile(i, j, 0, 0);
                    //     }
                    // }
                }
            })
    }
}
