import { Vector2, Vector3 } from "three";
import { Bootstrapper } from "../../../game/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../../game/engine/bootstrap/SceneBuilder";
import { PrefabRef } from "../../../game/engine/hierarchy_object/PrefabRef";
import { Color } from "../../../game/engine/render/Color";
import { GridInputPrefab } from "../../../game/prefab/GridInputPrefab";
import { EditorCameraController } from "../../../game/script/controller/EditorCameraController";
import { EditorViewObjectController } from "../../../game/script/controller/EditorViewObjectController";
import { BrushMode, ColliderBrush } from "../../../game/script/input/ColliderBrush";
import { GridPointer } from "../../../game/script/input/GridPointer";
import { ObjEditorConnector } from "../../../game/script/ObjEditorConnector";
import { GridCollideMap } from "../../../game/script/physics/GridColideMap";
import { EditorGridRenderer } from "../../../game/script/post_render/EditorGridRenderer";
import { Camera } from "../../../game/script/render/Camera";
import { CssSpriteRenderer } from "../../../game/script/render/CssSpriteRenderer";
import { Tools } from "../../organisms/EditorInner/ObjectEditorInner";

export class TileEditorBootstrapper extends Bootstrapper<ObjEditorConnector> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const collideMap = new PrefabRef<GridCollideMap>();
        const gridPointer = new PrefabRef<GridPointer>();
        const editorViewObjectController = new PrefabRef<EditorViewObjectController>();
        const colliderBrush = new PrefabRef<ColliderBrush>();

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
                editorViewObjectController.ref.setViewObject(shape as any, width, height);
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
                .withComponent(ColliderBrush, c => {
                    c.enabled = false;
                    c.gridPointer = gridPointer.ref!;
                    c.collideMap = collideMap.ref!;
                })
                .getComponent(ColliderBrush, colliderBrush))
            
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
