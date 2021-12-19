import { ApolloClient } from "@apollo/client";
import { IframeGameObject } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { IframeCommunicator } from "../../penpal";
import { IframeRenderer } from "../render/IframeRenderer";


export class PenpalConnection extends Component {
    // component
    protected _requiredComponents = [IframeRenderer];
    protected _disallowMultipleComponent = true;
    // client
    private _client: ApolloClient<any> | null = null;
    // info
    private _iframeCommunicator: IframeCommunicator | null = null;
    private _iframeInfo: IframeGameObject | null = null;
    private _worldId: string | null = null;

    public setApolloClient(client: ApolloClient<any>) {
        this._client = client;
    }

    public setIframeInfo(info: IframeGameObject) {
        this._iframeInfo = info;
    }

    public setWorldId(id: string) {
        this._worldId = id;
    }

    public start() {
        if (!this._client) throw new Error("Apollo client is not set");
        if (!this._iframeInfo) throw new Error("Iframe info is not set");
        if (!this._worldId) throw new Error("World id is not set");
        const iframeRenderer = this.gameObject.getComponent(IframeRenderer)
        
        if (!iframeRenderer) return;
        const iframeDom = iframeRenderer.htmlIframeElement;

        this._iframeCommunicator = new IframeCommunicator(this._client, iframeDom, this._iframeInfo, this._worldId);
    }
}
