import { TileAtlasItem } from "../component/render/CssTilemapRenderer";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { CameraRelativeZaxisSorter } from "../component/render/CameraRelativeZaxisSorter";
import { CssCollideTilemapChunkRenderer } from "../component/physics/CssCollideTilemapChunkRenderer";

export class TestTilemapChunkPrefab extends Prefab {
    private _colideTilemapRenderer: {ref: CssCollideTilemapChunkRenderer|null}|null = null;

    public getColideTilemapRendererRef(colideTilemapRenderer: {ref: CssCollideTilemapChunkRenderer|null}): TestTilemapChunkPrefab {
        this._colideTilemapRenderer = colideTilemapRenderer;
        return this;
    }

    public make(): GameObjectBuilder {
        return this._gameObjectBuilder
            .withComponent(CssCollideTilemapChunkRenderer, c => {
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
                        c.drawTile(0, -6, 0, 0);
                        for (let i = -10; i < 10; i++) {
                            for (let j = -10; j < 10; j++) {
                                const random = Math.random() > 0.9;
                                const random2 = Math.floor(Math.random() * 100);
                                if (random) c.drawTile(i, j, 1, random2);
                            }
                        }
                    }
                }
            })
            .withComponent(CameraRelativeZaxisSorter, c => c.offset -= 100)
            .getComponent(CssCollideTilemapChunkRenderer, this._colideTilemapRenderer ?? {ref: null});
    }
}
