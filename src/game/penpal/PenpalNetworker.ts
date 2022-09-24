import { ApolloClient, gql } from "@apollo/client";
import { TypedEmitter } from "detail-typed-emitter";

import { ProtoWebSocket } from "../../proto/ProtoWebSocket";
import * as pb from "../../proto/the_world";
import { Server } from "../connect/types";

type FieldId = number;
type BroadcastId = number;
type PluginId = number;

type EETypes = [
    [`update_field_${FieldId}`,         (value: string, userId: string) => void],
    [`update_broadcast_${BroadcastId}`, (message: string, userId: string) => void],
    [`plugin_message_sent_${PluginId}`, (message: string) => void]
]

export class PenpalNetworker {
    private readonly _ee: TypedEmitter<EETypes>;

    public constructor(
        private readonly _client: ApolloClient<any>,
        private readonly _protoClient: ProtoWebSocket<pb.ServerEvent>) {
        this._ee = new TypedEmitter<EETypes>();
        this.initNetwork();
    }

    private initNetwork(): void {
        this._protoClient.on("message", serverEvent => {
            if(serverEvent.event === "fieldValueSetted") {
                const data = serverEvent.fieldValueSetted;
                const { id: publicFieldId, value, userId } = data;

                this._ee.emit(`update_field_${publicFieldId}`, value, userId);
            } else if(serverEvent.event === "messageBroadcasted") {
                const data = serverEvent.messageBroadcasted;
                const { id: publicBroadcastId, message, userId } = data;
                
                this._ee.emit(`update_broadcast_${publicBroadcastId}`, message, userId);
            } else if(serverEvent.event === "pluginMessageSent") {
                const data = serverEvent.pluginMessageSent;
                const { pluginId, message } = data;

                this._ee.emit(`plugin_message_sent_${pluginId}`, message);
            }
        });
    }

    public setFieldValue(id: number, value: string): void {
        this._protoClient.send(new pb.ClientEvent({
            setFieldValue: new pb.SetFieldValue({
                id,
                value
            })
        }));
    }

    public broadcast(id: number, message: string): void {
        this._protoClient.send(new pb.ClientEvent({
            broadcast: new pb.Broadcast({
                id,
                message
            })
        }));
    }

    public sendPluginMessage(id: number, message: string): void {
        this._protoClient.send(new pb.ClientEvent({
            sendPluginMessage: new pb.SendPluginMessage({
                pluginId: id,
                message: message
            })
        }));
    }

    public async getUser(id?: string): Promise<Server.User | null> {
        if (id === undefined) {
            const result = await this._client.query({
                query: gql`
                    query CurrentUser {
                        currentUser {
                            id
                            nickname
                        }
                    }
                `
            });
            return result.data.currentUser;
        } else {
            const result = await this._client.query({
                query: gql`
                    query User($id: String!) {
                        User(id: $id) {
                            id
                            nickname
                        }
                    }
                `,
                variables: {
                    id
                }
            });
            return result.data.User;
        }
    }

    public onFieldListUpdate(iframeId: number, cb: (portMappings: Server.IframeFieldPortMapping[]) => void): ZenObservable.Subscription {
        return this._client.subscribe({
            query: gql`
                subscription IframeFieldPortMappingList($iframeId: Int!) {
                    iframeFieldPortMappingList(iframeId: $iframeId) {
                        id
                        portId
                        field {
                            id
                            value
                        }
                    }
                }
            `,
            variables: {
                iframeId
            }
        }).subscribe(result => {
            cb(result.data.iframeFieldPortMappingList);
        });
    }

    public onBroadcastListUpdate(iframeId: number, cb: (portMappings: Server.IframeBroadcasterPortMapping[]) => void): ZenObservable.Subscription {
        return this._client.subscribe({
            query: gql`
                subscription IframeBroadcasterPortMappingList($iframeId: Int!) {
                    iframeBroadcasterPortMappingList(iframeId: $iframeId) {
                        id
                        portId
                        broadcaster {
                            id
                        }
                    }
                }
            `,
            variables: {
                iframeId: iframeId
            }
        }).subscribe(result => {
            cb(result.data.iframeBroadcasterPortMappingList);
        });
    }

    public onPluginPortMappingCreated(iframeId: number, cb: (portMapping: Server.PluginPortMapping) => void): () => void {
        const listener = (serverEvent: pb.ServerEvent): void => {
            if(serverEvent.has_iframePluginPortMappingCreated) {
                const e = serverEvent.iframePluginPortMappingCreated;
                if(e.iframeId === iframeId) {
                    cb({
                        id: e.id,
                        portId: e.portId,
                        plugin: {
                            id: e.pluginId,
                            name: e.pluginName
                        }
                    });
                }
            }
        };
        
        this._protoClient.on("message", listener);

        return () => this._protoClient.off("message", listener);
    }

    public onPluginPortMappingDeleted(iframeId: number, cb: (id: number) => void): () => void {
        const listener = (serverEvent: pb.ServerEvent): void => {
            if(serverEvent.has_iframePluginPortMappingDeleted) {
                const e = serverEvent.iframePluginPortMappingDeleted;
                if(e.iframeId === iframeId) {
                    cb(e.id);
                }
            }
        };

        this._protoClient.on("message", listener);

        return () => this._protoClient.off("message", listener);
    }

    public get ee(): TypedEmitter<EETypes> {
        return this._ee;
    }

    public get client(): ApolloClient<any> {
        return this._client;
    }

    public get protoClient(): ProtoWebSocket<pb.ServerEvent> {
        return this._protoClient;
    }
}
