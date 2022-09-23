
import { DumbTypedEmitter } from "detail-typed-emitter";
import { ProtoWebSocket } from "../../../proto/ProtoWebSocket";

import { Server } from "../../connect/types";
import * as pb from "../../../proto/the_world";

type DEETypes = {
    "create": (collider: Server.AtlasTile) => void,
    "update": (collider: Server.AtlasTile) => void,
    "delete": (x: number, y: number, type: number) => void,
}

export class TileNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    public constructor(
        private readonly _protoClient: ProtoWebSocket<pb.ServerEvent>
    ) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this.initNetwork();
    }

    private initNetwork(): void {
        this._protoClient.on("message", serverEvent => {
            if(serverEvent.has_atlasTileCreated) {
                const e = serverEvent.atlasTileCreated;
                this._dee.emit("create", e as unknown as Server.AtlasTile);
            } else if(serverEvent.has_atlasTileDeleted) {
                const e = serverEvent.atlasTileDeleted;
                this._dee.emit("delete", e.x, e.y, e.type);
            } else if(serverEvent.has_atlasTileUpdated) {
                const e = serverEvent.atlasTileUpdated;
                this._dee.emit("update", e as unknown as Server.AtlasTile);
            }
        });
    }

    public get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}
