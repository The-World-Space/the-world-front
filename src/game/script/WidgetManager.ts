import { Server } from "../connect/types";
import { IframeCommunicator } from "../penpal";
import { PenpalNetworker } from "../penpal/PenpalNetworker";

export class WidgetManager {
    private _iframes: HTMLIFrameElement[] = [];
    private _iframeCommunicators: IframeCommunicator[] = [];

    constructor(
            private readonly _penpalNetworkManager: PenpalNetworker,
            private readonly _world: Server.World,
            private readonly _wrapperDiv: HTMLDivElement,
            private _widgetIframeInfos: Server.IframeWidget[]) {
        this._init();
    }

    private _init() {
        this._iframes = this._widgetIframeInfos.map(widget => {
            const iframe = document.createElement("iframe");

            iframe.src = widget.src;

            iframe.style.width = widget.width;
            iframe.style.height = widget.height;
            iframe.style.position = "absolute";

            iframe.style.border = "none";

            const anc = widget.anchor;
            
            iframe.style.left = 
                (anc % 3 === 0) ? "0px" : 
                (anc % 3 === 1) ? "50%" : "";
            iframe.style.right = (anc % 3 === 2) ? "0px" : "";

            iframe.style.top = 
                (anc <= 2) ? "0px" : 
                (anc <= 5) ? "50%" : "";
            iframe.style.bottom = (anc >= 6) ? "0px" : "";

            iframe.style.pointerEvents = "auto";

            const translateX = (anc % 3 === 1) ? "-50%" : "0";
            const translateY = (3 <= anc && anc <= 5) ? "-50%" : "0";

            iframe.style.transform += `translate(${translateX}, ${translateY}) translate(${widget.offsetX}, ${widget.offsetY})`;
            return iframe;
        });

        this._iframeCommunicators = this._iframes.map((iframe, i) => {
            const widgetInfo = this._widgetIframeInfos[i];
            
            const communicator =  new IframeCommunicator(iframe, widgetInfo, this._penpalNetworkManager);
            communicator.apply();
            
            return communicator;
        });

        this._wrapperDiv.append(...this._iframes);
    }

    public dispose() {
        this._iframes.forEach(iframe => {
            iframe.remove();
        });
        this._iframeCommunicators.forEach(iframeCommunicator => {
            iframeCommunicator.stop();
        });
    }
}