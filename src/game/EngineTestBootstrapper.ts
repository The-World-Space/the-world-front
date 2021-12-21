import { CssCollideTilemapChunkRenderer } from "./script/physics/CssCollideTilemapChunkRenderer";
import { Camera } from "./script/render/Camera";
import { TileAtlasItem } from "./script/render/CssTilemapRenderer";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
export class EngineTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("Camera")
                .withComponent(Camera))
            .withChild(instantlater.buildGameObject("TestObject")
                .withComponent(CssCollideTilemapChunkRenderer, c => {
                    const tilemap3 = new Image();
                    tilemap3.src = "/assets/tilemap/room_sanscorridor.png";

                    c.imageSources = [ new TileAtlasItem(tilemap3, 3, 20) ];
                    c.pointerEvents = false;

                    tilemap3.onload = () => {
                        tilemap3.onload = null;
                        debugger;
                        c.drawTileFromTwoDimensionalArray([[{i: 0, a: 0}]], 0, 0);
                    }
                }));
    }
}
