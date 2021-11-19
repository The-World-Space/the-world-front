import { ApolloClient } from "@apollo/client";
import { IframeCommunicator } from "../../game/penpal";
import { GameObject } from "./GameObject"
import { IframeShape } from "./Shape/IframeShape"
import { IframeGameObject as ServerIframeGameObject } from "../../game/connect/types";

export class IframeGameObject extends GameObject<IframeShape> {
    private _iframeCommunicator: IframeCommunicator;

    constructor(shape: IframeShape, iframeInfo: ServerIframeGameObject, apolloClient: ApolloClient<any>, worldId: string) {
        super(shape);
        this._iframeCommunicator = new IframeCommunicator(apolloClient, shape.getDom(), iframeInfo, worldId);
        this._iframeCommunicator.apply();
        shape.getDom().allow = "midi;  autoplay";
    }

    getIframeCommunicator() {
        return this._iframeCommunicator;
    }

    setIframeCommunicator(iframeCommunicator: IframeCommunicator) {
        this._iframeCommunicator = iframeCommunicator;
        this._iframeCommunicator.apply();
    }
}