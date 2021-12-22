import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { IframeCommunicator } from "../../penpal";
import { PenpalNetworkWrapper } from "../../penpal/PenpalNetworkWrapper";
import { IframeRenderer } from "../render/IframeRenderer";


export class PenpalConnection extends Component {
    // component
    protected _requiredComponents = [IframeRenderer];
    protected _disallowMultipleComponent = true;
    // info
    private _iframeCommunicator: IframeCommunicator | null = null;
    private _iframeInfo: Server.IframeGameObject | null = null;
    private _penpalNetworkWrapper: PenpalNetworkWrapper | null = null;

    public set iframeInfo(info: Server.IframeGameObject) {
        this._iframeInfo = info;
    }

    public set penpalNetworkWrapper(value: PenpalNetworkWrapper) {
        this._penpalNetworkWrapper = value;
    }

    public start() {
        if (!this._iframeInfo) throw new Error("Iframe info is not set");
        if (!this._penpalNetworkWrapper) throw new Error("Penpal network wrapper is not set");
        const iframeRenderer = this.gameObject.getComponent(IframeRenderer);
        
        if (!iframeRenderer) return;
        const iframeDom = iframeRenderer.htmlIframeElement;

        iframeDom.allow = "midi;  autoplay";

        this._iframeCommunicator = new IframeCommunicator(iframeDom, this._iframeInfo, this._penpalNetworkWrapper);
        this._iframeCommunicator.apply();
    }

    public onDestroy(): void {
        this._iframeCommunicator?.stop();
    }
}
