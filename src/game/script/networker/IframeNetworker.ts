import { ApolloClient, gql } from "@apollo/client";
import { DumbTypedEmitter } from "detail-typed-emitter";
import { Server } from "../../connect/types";

const IFRAME_FILEDS = gql`
fragment IframeFields on IframeGameObject {
    id
    fieldPortMappings {
        id
        portId
        field {
            id
            name
            value
        }
    }
    broadcasterPortMappings {
        id
        portId
        broadcaster {
            id
            name
        }
    }
    localBroadcasters {
        id
        name
    }
    localFields {
        id
        name
        value
    }
    x
    y
    proto {
        id
        name
        owner {
            id
            nickname
            skinSrc
        }
        isPublic
        width
        height
        offsetX
        offsetY
        type
        colliders {
            x
            y
            isBlocked
        }
        src
    }
}
`;


type iframeId = number;


type DEETypes = {
    "create" : (iframeInfo: Server.IframeGameObject) => void,
    "delete" : (id: iframeId) => void
}


export class IframeNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    constructor(private readonly _worldId: string,
                private readonly _client: ApolloClient<any>) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this._initNetwork();
        // this._initEEListenters();
    }

    private _initNetwork() {
        this._client.subscribe({
            query: gql`
                subscription IframeGOCreateing($worldId: String!) {
                    iframeGameObjectCreating(worldId: $worldId) {
                        ...IframeFields
                    }
                }

                ${IFRAME_FILEDS}
            `,
            variables: {
                worldId: this._worldId,
            }
        }).subscribe(data => {
            if (!data.data.iframeGameObjectCreating) throw new Error("data.data.iframeGameObjectCreating is falsy");
            const iframeInfo = data.data.iframeGameObjectCreating as Server.IframeGameObject;
            
            this._dee.emit("create", iframeInfo);
        });

        this._client.subscribe({
            query: gql`
                subscription IframeGODeleting($worldId: String!) {
                    iframeGameObjectDeleting(worldId: $worldId)
                }
            `,
            variables: {
                worldId: this._worldId,
            }
        }).subscribe(data => {
            if (!data.data.iframeGameObjectDeleting) throw new Error("data.data.iframeGameObjectDeleting is falsy");
            const deletingId = data.data.iframeGameObjectDeleting as iframeId;
            
            this._dee.emit("delete", deletingId);
        });
    }


    // private _initEEListenters() {
        
        
    // }


    get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}

