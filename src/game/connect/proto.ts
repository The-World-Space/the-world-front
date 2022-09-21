import { ProtoWebSocket } from "../../proto/ProtoWebSocket";
import * as pb from "../../proto/the_world";
import { getSession } from "./gql";

const PROTO_WS_ADDR = "wss://api.the-world.space/proto"; // "ws://127.0.0.1:40006/"; // 

export function getProtoWebSocket(): ProtoWebSocket<pb.ServerEvent> {
    const webSocket = new WebSocket(PROTO_WS_ADDR);
    return new ProtoWebSocket(webSocket, bytes => pb.ServerEvent.deserializeBinary(bytes));
}

export function login(webSocket: WebSocket): void {
    const jwt = getSession().token;

    if(jwt === null) {
        throw new Error("JWT must be not null here");
    }

    webSocket.send(jwt);
}

export function joinWorld(protoWebSocket: ProtoWebSocket<pb.ServerEvent>, worldId: string, x: number, y: number): void {
    protoWebSocket.send(new pb.ClientEvent({
        joinWorld: new pb.JoinWorld({
            x: x,
            y: y,
            id: worldId
        })
    }));
}
