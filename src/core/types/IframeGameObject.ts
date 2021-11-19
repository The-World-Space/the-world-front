import { ApolloClient } from "@apollo/client";
import { IframeCommunicator } from "../../game/penpal";
import { GameObject } from "./GameObject"
import { IframeShape } from "./Shape/IframeShape"
import { IframeGameObject as ServerIframeGameObject } from "../../game/connect/types";

export class IframeGameObject extends GameObject<IframeShape> {
    private _iframeCommunicator: IframeCommunicator;

    constructor(shape: IframeShape, iframeInfo: ServerIframeGameObject, apolloClient: ApolloClient<any>) {
        super(shape);
        // @ts-ignore
        globalThis.debug_shape = {
            shape,
            iframeInfo
        };
        console.debug(shape.getDom());
        this._iframeCommunicator = new IframeCommunicator(apolloClient, shape.getDom(), iframeInfo);
    }

    getIframeCommunicator() {
        return this._iframeCommunicator;
    }

    setIframeCommunicator(iframeCommunicator: IframeCommunicator) {
        this._iframeCommunicator = iframeCommunicator;
    }
}