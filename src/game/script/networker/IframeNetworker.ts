
import { DumbTypedEmitter } from "detail-typed-emitter";

import { ProtoWebSocket } from "../../../proto/ProtoWebSocket";
import * as pb from "../../../proto/the_world";
import { Server } from "../../connect/types";

type iframeId = number;

type DEETypes = {
    "create": (iframeInfo: Server.IframeGameObject) => void,
    "delete": (id: iframeId) => void
}

export class IframeNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    public constructor(
        private readonly _protoClient: ProtoWebSocket<pb.ServerEvent>
    ) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this.initNetwork();
        // this._initEEListenters();
    }

    private initNetwork(): void {
        this._protoClient.on("message", serverEvent => {
            if(serverEvent.has_iframeGameObjectCreated) {
                const e = serverEvent.iframeGameObjectCreated;

                const proto = e.iframeGameObjectProto;

                this._dee.emit("create", {
                    id: e.id,
                    fieldPortMappings: [],
                    broadcasterPortMappings: [],
                    localBroadcasters: [],
                    localFields: [],
                    x: e.x,
                    y: e.y,
                    proto_: {
                        id: proto.id,
                        name: proto.name,
                        isPublic: proto.isPublic,
                        type: proto.type,
                        width: proto.width,
                        height: proto.height,
                        offsetX: proto.offsetX,
                        offsetY: proto.offsetY,
                        colliders: [],
                        src: proto.src,
                        owner: {
                            id: proto.ownerId
                        }
                    }
                } as unknown as Server.IframeGameObject);
            } else if(serverEvent.has_iframeGameObjectDeleted) {
                const e = serverEvent.iframeGameObjectDeleted;
                this._dee.emit("delete", e.id);
            }
        });
    }

    public get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}
