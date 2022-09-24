
import { DumbTypedEmitter } from "detail-typed-emitter";

import { ProtoWebSocket } from "../../../proto/ProtoWebSocket";
import * as pb from "../../../proto/the_world";
import { Server } from "../../connect/types";

type DEETypes = {
    "update": (collider: Server.Collider) => void,
}

export class ColliderNetworker {
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
            if(serverEvent.has_colliderUpdated) {
                const e = serverEvent.colliderUpdated;
                
                this._dee.emit("update", { x: e.x, y: e.y, isBlocked: e.isBlocked });
            }
        });
    }

    public get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}
