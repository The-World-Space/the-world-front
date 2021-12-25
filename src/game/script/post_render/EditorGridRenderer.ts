import { Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { Camera } from "../render/Camera";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";

export class EditorGridRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];
    
    private _camera: Camera|null = null;
    private _cssHtmlRenderer: CssHtmlElementRenderer|null = null;

    protected awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
        
        const cssHtmlRendererRef = new PrefabRef<CssHtmlElementRenderer>();

        this.gameObject.addChildFromBuilder(
            this.engine.instantlater.buildGameObject("grid-renderer", new Vector3(0, 0, -1))
                .withComponent(CssHtmlElementRenderer, c => {
                    const element = document.createElement("div");
                    //element.style.backgroundColor = "red";
                    c.elementWidth = 100;
                    c.elementHeight = 100;
                    c.setElement(element);
                })
                .getComponent(CssHtmlElementRenderer, cssHtmlRendererRef));
        
        this._cssHtmlRenderer = cssHtmlRendererRef.ref;
    }
}