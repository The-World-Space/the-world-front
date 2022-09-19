import { ApolloClient, gql } from "@apollo/client";
import { DumbTypedEmitter } from "detail-typed-emitter";

import { Server } from "../../connect/types";

const IMAGE_FILEDS = gql`
fragment ImageFields on ImageGameObject {
    id
    x
    y
    proto_ {
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


type imageId = number;


type DEETypes = {
    "create": (iframeInfo: Server.ImageGameObject) => void,
    "delete": (id: imageId) => void
}


export class ImageNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    public constructor(
        private readonly _worldId: string,
        private readonly _client: ApolloClient<any>
    ) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this.initNetwork();
        // this._initEEListenters();
    }

    private initNetwork(): void {
        this._client.subscribe({
            query: gql`
                subscription ImageGOCreateing($worldId: String!) {
                    imageGameObjectCreating(worldId: $worldId) {
                        ...ImageFields
                    }
                }

                ${IMAGE_FILEDS}
            `,
            variables: {
                worldId: this._worldId
            }
        }).subscribe(data => {
            if (!data.data.imageGameObjectCreating) throw new Error("data.data.iframeGameObjectCreating is falsy");
            const iframeInfo = data.data.imageGameObjectCreating as Server.ImageGameObject;
            
            this._dee.emit("create", iframeInfo);
        });

        this._client.subscribe({
            query: gql`
                subscription ImageGODeleting($worldId: String!) {
                    imageGameObjectDeleting(worldId: $worldId)
                }
            `,
            variables: {
                worldId: this._worldId
            }
        }).subscribe(data => {
            if (!data.data.imageGameObjectDeleting) throw new Error("data.data.iframeGameObjectDeleting is falsy");
            const deletingId = data.data.imageGameObjectDeleting as imageId;
            
            this._dee.emit("delete", deletingId);
        });
    }

    public get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}
