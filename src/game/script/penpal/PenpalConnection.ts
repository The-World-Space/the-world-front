import { Server } from "../../connect/types";
import { Component, CssIframeRenderer } from "the-world-engine";
import { IframeCommunicator } from "../../penpal";
import { PenpalNetworker } from "../../penpal/PenpalNetworker";

export class PenpalConnection extends Component {
    // component
    public override readonly requiredComponents = [CssIframeRenderer];
    public override readonly disallowMultipleComponent = true;
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

        const iframeRenderer = this.gameObject.getComponent(CssIframeRenderer)!;
        iframeRenderer.allow = "midi; autoplay; camera; microphone;";

        const iframeElement = (iframeRenderer as any).htmlElement as HTMLIFrameElement;

        this._iframeCommunicator = new IframeCommunicator(iframeElement, this._iframeInfo, this._penpalNetworkWrapper);
        this._iframeCommunicator.apply();
    }

    public onDestroy(): void {
        this._iframeCommunicator?.stop();
    }
}
