import { Server } from "../../connect/types";
import { Component, CssIframeRenderer } from "the-world-engine";
import { IframeCommunicator } from "../../penpal";
import { PenpalNetworker } from "../../penpal/PenpalNetworker";

export class PenpalConnection extends Component {
    // component
    protected _requiredComponents = [CssIframeRenderer];
    protected _disallowMultipleComponent = true;
    // info
    private _iframeCommunicator: IframeCommunicator | null = null;
    private _iframeInfo: Server.IframeGameObject | null = null;
    private _penpalNetworkWrapper: PenpalNetworker | null = null;

    public set iframeInfo(info: Server.IframeGameObject) {
        this._iframeInfo = info;
    }

    public set penpalNetworkWrapper(value: PenpalNetworker) {
        this._penpalNetworkWrapper = value;
    }

    public start(): void {
        if (!this._iframeInfo) throw new Error("Iframe info is not set");
        if (!this._penpalNetworkWrapper) throw new Error("Penpal network wrapper is not set");
        const iframeRenderer = this.gameObject.getComponent(CssIframeRenderer);
        
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
