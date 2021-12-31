import { Vector2, Vector3 } from "three";
import { 
    Bootstrapper,
    SceneBuilder,
    PrefabRef,
    Color,
    EditorCameraController,
    GridPointer,
    GridCollideMap,
    EditorGridRenderer,
    Camera,
    CssSpriteRenderer
} from "the-world-engine";
import { GridInputPrefab } from "../../../game/prefab/GridInputPrefab";
import { EditorViewObjectController } from "../../../game/script/controller/EditorViewObjectController";
import { BrushMode, GridColliderBrush } from "../../../game/script/input/GridColliderBrush";
import { ObjEditorConnector } from "../../../game/script/ObjEditorConnector";
import { Tools } from "../../organisms/EditorInner/ObjectEditorInner";

export class TileEditorBootstrapper extends Bootstrapper<ObjEditorConnector> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const collideMap = new PrefabRef<GridCollideMap>();
        const gridPointer = new PrefabRef<GridPointer>();
        const editorViewObjectController = new PrefabRef<EditorViewObjectController>();
        const colliderBrush = new PrefabRef<GridColliderBrush>();

        this.interopObject!.action = {
            setToolType(tools) {
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
            setColliders(colliders) {
                if (!collideMap.ref) throw new Error("collideMap is not set");
                for (const collider of colliders) {
                    collideMap.ref.addCollider(collider.x, collider.y);
                }
            },
            clearColliders() {
                if (!collideMap.ref) return;
                collideMap.ref.removeAllColliders();
            },
            setViewObject(shape, width, height) {
                if (!editorViewObjectController.ref) return;
                editorViewObjectController.ref.setViewObject(shape, width, height);
            },
            setViewObjectSize(width, height) {
                if (!editorViewObjectController.ref) return;
                editorViewObjectController.ref.setViewObjectSize(width, height);
            },
            clearViewObject() {
                if (!editorViewObjectController.ref) return;
                editorViewObjectController.ref.clearViewObject();
            }
        };

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 100))
                .withComponent(Camera, c => {
                    c.viewSize = 80;
                    c.backgroundColor = new Color(0.9, 0.9, 0.9);
                })
                .withComponent(EditorCameraController)
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 100;
                    c.renderHeight = 500;
                }))

            .withChild(instantlater.buildGameObject("collide_map")
                .withComponent(GridCollideMap, c => c.showCollider = true)
                .getComponent(GridCollideMap, collideMap))
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab)
                .withCollideMap(collideMap)
                .getGridPointer(gridPointer).make()
                .withComponent(GridColliderBrush, c => {
                    c.enabled = false;
                    c.gridPointer = gridPointer.ref!;
                    c.collideMap = collideMap.ref!;
                })
                .getComponent(GridColliderBrush, colliderBrush))
            
            .withChild(instantlater.buildGameObject("view_object", new Vector3(-8, -8, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.enabled = false;
                    c.pointerEvents = false;
                    c.imageCenterOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(EditorViewObjectController)
                .getComponent(EditorViewObjectController, editorViewObjectController));
    }
}
