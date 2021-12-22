import { Server } from "../connect/types";
import { PenpalNetworkWrapper } from "../penpal/PenpalNetworkWrapper";

export class WidgetManager {
    private readonly widgetIframeInfos: Server.IframeGameObject[];

    constructor(
            private readonly penpalNetworkManager: PenpalNetworkWrapper,
            private readonly world: Server.World,
            private readonly wrapperDiv: HTMLDivElement,
            private readonly gameDiv: HTMLDivElement) {
        this.widgetIframeInfos = [];
    }

}