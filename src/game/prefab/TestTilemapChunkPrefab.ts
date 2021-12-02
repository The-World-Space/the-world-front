import { CssTilemapChunkRenderer } from "../component/post_render/CssTilemapChunkRenderer";
import { TileAtlasItem } from "../component/render/CssTilemapRenderer";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { CameraRelativeZaxisSorter } from "../component/render/CameraRelativeZaxisSorter";

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
                        for (let i = -20; i < 20; i++) {
                            for (let j = -20; j < 20; j++) {
                                const random = Math.random() > 0.5;
                                const random2 = Math.floor(Math.random() * 100);
                                if (random) c.drawTile(i, j, 1, random2);
                            }
                        }
                    }
                }
            })
            .withComponent(CameraRelativeZaxisSorter, c => c.offset -= 100)
    }
}
