import { Server } from "../connect/types";
import { IframeCommunicator } from "../penpal";
import { PenpalNetworkWrapper } from "../penpal/PenpalNetworkWrapper";

export class WidgetManager {
    private readonly _widgetIframeInfos: Server.IframeWidget[];
    private _iframes: HTMLIFrameElement[] = [];
    private _iframeCommunicators: IframeCommunicator[] = [];

    constructor(
            private readonly _penpalNetworkManager: PenpalNetworkWrapper,
            private readonly _world: Server.World,
            private readonly _wrapperDiv: HTMLDivElement) {
        this._widgetIframeInfos = [];
    }

    private _init() {
        this._iframes = this._widgetIframeInfos.map(widget => {
            const iframe = document.createElement('iframe');

            iframe.src = widget.src;

            iframe.style.width = widget.width;
            iframe.style.height = widget.height;

            const anc = widget.anchor;
            
            iframe.style.left   = (anc % 3 == 0) ? '0px' : 
                                  (anc % 3 == 1) ? '50%' : '';
            iframe.style.right  = (anc % 3 == 2) ? '0px' : '';

            iframe.style.top    = (anc <= 2) ? '0px' : 
                                  (anc <= 5) ? '50%' : '';
            iframe.style.bottom = (anc >= 6) ? '0px' : '';

            const translateX = (anc % 3 == 1)         ? '-50%' : '0';
            const translateY = (3 <= anc && anc <= 5) ? '-50%' : '0';

            iframe.style.transform += `translate(${translateX}, ${translateY}) translate(${widget.offsetX}, ${widget.offsetY})`;
            return iframe;
        });
    }
}