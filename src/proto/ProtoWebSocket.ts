import * as pb from "google-protobuf";
import EventEmitter from "wolfy87-eventemitter";

export interface ProtoWebSocket<T> extends EventEmitter {
    on(event: RegExp | string, f: (...args: any) => void): this;
    on(event: "message", f: (data: T) => void): this;
}

export class ProtoWebSocket<T> extends EventEmitter {
    public readonly webSocket: WebSocket;
    public constructor(webSocket: WebSocket, decodeFunction: (bytes: Uint8Array) => T) {
        super();
        this.webSocket = webSocket;

        webSocket.addEventListener("message", async message => {
            const blob: Blob = message.data;
            const arrayBuffer = await blob.arrayBuffer();
            this.emit("message", decodeFunction(new Uint8Array(arrayBuffer)));
        });
    }
    
    public send(message: pb.Message): void {
        this.webSocket.send(message.serializeBinary());
    }

    public close(): void {
        this.webSocket.close();
    }
}
