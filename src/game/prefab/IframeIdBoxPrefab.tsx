import { GameObject, GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { CssHtmlElementRenderer } from "../script/render/CssHtmlElementRenderer";

export class IframeIdBoxPrefab extends Prefab {
    private _idboxRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
    private _idboxObject: PrefabRef<GameObject> = new PrefabRef();

    public getIdBoxRenderer(idBoxRenderer: PrefabRef<CssHtmlElementRenderer>): IframeIdBoxPrefab {
        this._idboxRenderer = idBoxRenderer;
        return this;
    }

    public getIdBoxObject(idBoxObject: PrefabRef<GameObject>): IframeIdBoxPrefab {
        this._idboxObject = idBoxObject;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssHtmlElementRenderer, c => {
                c.autoSize = true;
                c.setElementFromJSX(
                    <div style={{
                        borderRadius: "15px",
                        background: "#000000",
                        color: "#ffffff", 
                        textAlign: "center",
                        padding: "5px 10px",
                        opacity: 0.5,
                        fontFamily: "Noto Sans",
                    }}>
                        chat content
                    </div>
                );
                c.pointerEvents = false;
            })
            .getComponent(CssHtmlElementRenderer, this._idboxRenderer)
            .getGameObject(this._idboxObject);
    }
}
