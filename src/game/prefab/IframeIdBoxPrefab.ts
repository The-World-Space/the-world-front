import { GameObject, GameObjectBuilder, Prefab, PrefabRef, CssHtmlElementRenderer } from "the-world-engine";
import { Vector2 } from "three/src/Three";

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
                const idBoxDiv = document.createElement("div");
                idBoxDiv.style.borderRadius = "15px";
                idBoxDiv.style.backgroundColor = "#000000",
                idBoxDiv.style.color = "#ffffff";
                idBoxDiv.style.textAlign = "center";
                idBoxDiv.style.padding = "5px 10px";
                idBoxDiv.style.opacity = "0.5";
                idBoxDiv.style.fontFamily = "Noto Sans";
                idBoxDiv.innerText = "content";
                c.centerOffset = new Vector2(0.5, -1.6);
                c.pointerEvents = false;
                c.element = idBoxDiv;
                c.viewScale = 0.07;
            })
            .getComponent(CssHtmlElementRenderer, this._idboxRenderer)
            .getGameObject(this._idboxObject);
    }
}
