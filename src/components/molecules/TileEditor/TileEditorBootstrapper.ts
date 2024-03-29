import { 
    Bootstrapper,
    Camera,
    Color,
    CssSpriteRenderer,
    EditorCameraController,
    EditorGridRenderer,
    GridCollideMap,
    GridPointer,
    PrefabRef,
    SceneBuilder} from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";

import { GridInputPrefab } from "../../../game/prefab/GridInputPrefab";
import { EditorViewObjectController } from "../../../game/script/controller/EditorViewObjectController";
import { CameraHorizontalViewSizeSetter } from "../../../game/script/helper/CameraHorizontalViewSizeSetter";
import { BrushMode, GridColliderBrush } from "../../../game/script/input/GridColliderBrush";
import { ObjEditorConnector } from "../../../game/script/ObjEditorConnector";
import { Tools } from "../../organisms/EditorInner/ObjectEditorInner";

export class TileEditorBootstrapper extends Bootstrapper<ObjEditorConnector> {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        const collideMap = new PrefabRef<GridCollideMap>();
        const gridPointer = new PrefabRef<GridPointer>();
        const editorViewObjectController = new PrefabRef<EditorViewObjectController>();
        const colliderBrush = new PrefabRef<GridColliderBrush>();

        this.interopObject!.action = {
            setToolType(tools): void {
                if (!colliderBrush.ref) return;
                if (tools === Tools.Collider) {
                    colliderBrush.ref.enabled = true;
                    colliderBrush.ref.brushMode = BrushMode.Draw;
                } else if (tools === Tools.Eraser) {
                    colliderBrush.ref.enabled = true;
                    colliderBrush.ref.brushMode = BrushMode.Erase;
                } else {
                    colliderBrush.ref.enabled = false;
                }
            },
            getColliders(): Vector2[] {
                if (!collideMap.ref) return [];
                return collideMap.ref.getCollidersToArray();
            },
            setColliders(colliders): void {
                if (!collideMap.ref) throw new Error("collideMap is not set");
                for (const collider of colliders) {
                    collideMap.ref.addCollider(collider.x, collider.y);
                }
            },
            clearColliders(): void {
                if (!collideMap.ref) return;
                collideMap.ref.removeAllColliders();
            },
            setViewObject(shape, width, height): void {
                if (!editorViewObjectController.ref) return;
                editorViewObjectController.ref.setViewObject(shape, width, height);
            },
            setViewObjectSize(width, height): void {
                if (!editorViewObjectController.ref) return;
                editorViewObjectController.ref.setViewObjectSize(width, height);
            },
            clearViewObject(): void {
                if (!editorViewObjectController.ref) return;
                editorViewObjectController.ref.clearViewObject();
            }
        };

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 100))
                .withComponent(Camera, c => {
                    c.backgroundColor = new Color(0.9, 0.9, 0.9);
                    c.viewSize = 3.5;
                })
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 5.5;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 10;
                    c.renderHeight = 50;
                })
                .withComponent(CameraHorizontalViewSizeSetter))

            .withChild(instantiater.buildGameObject("collide_map")
                .withComponent(GridCollideMap, c => c.showCollider = true)
                .getComponent(GridCollideMap, collideMap))
            
            .withChild(instantiater.buildPrefab("grid_input", GridInputPrefab)
                .withCollideMap(collideMap)
                .getGridPointer(gridPointer).make()
                .withComponent(GridColliderBrush, c => {
                    c.enabled = false;
                    c.gridPointer = gridPointer.ref!;
                    c.collideMap = collideMap.ref!;
                })
                .getComponent(GridColliderBrush, colliderBrush))
            
            .withChild(instantiater.buildGameObject("view_object", new Vector3(-0.5, -0.5, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.enabled = false;
                    c.pointerEvents = false;
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(EditorViewObjectController)
                .getComponent(EditorViewObjectController, editorViewObjectController));
    }
}
