import { ApolloClient, gql } from "@apollo/client";
import { TypedEmitter } from "detail-typed-emitter";
import { Server } from "../connect/types";

type fieldId = string;
type broadcastId = string;

type EETypes = [
    [`update_field_${fieldId}`,         (value: string, userId: string) => void],
    [`update_broadcast_${broadcastId}`, (message: string, userId: string) => void],
]

export class PenpalNetworker {
    private readonly _ee: TypedEmitter<EETypes>;

    constructor(private readonly _worldId: string,
        private readonly _client: ApolloClient<any>) {
        this._ee = new TypedEmitter<EETypes>();
        this._initNetwork();
    }

    private _initNetwork() {
        // Update field
        this._client.subscribe({
            query: gql`
                subscription FieldSetValue($worldId: String!) {
                    fieldSetValue(worldId: $worldId) {
                        id,
                        value,
                        userId
                    }
                }
            `,
            variables: {
                worldId: this._worldId
            }
        }).subscribe(result => {
            const { id: publicFieldId, value, userId } = result.data.fieldSetValue as { id: number, value: string, userId: string };
            
            this._ee.emit(`update_field_${publicFieldId}`, value, userId);
        });

        // Update broadcast
        this._client.subscribe({
            query: gql`
                subscription BroadcastMessage($worldId: String!) {
                    broadcastMessage(worldId: $worldId) {
                        id
                        message
                        userId
                    }
                }
            `,
            variables: {
                worldId: this._worldId
            }
        }).subscribe(result => {
            const { id: publicBroadcastId, message, userId } = result.data.broadcastMessage as { id: number, message: string, userId: string };

            this._ee.emit(`update_broadcast_${publicBroadcastId}`, message, userId);
        })
    }


    public async setFieldValue(id: number | undefined, value: string) {
        await this._client.mutate({
            mutation: gql`
            mutation SetFieldValue($id: Int!, $value: String!) {
                setFieldValue(id: $id, value: $value)
              }
            `,
            variables: {
                id,
                value
            }
        });
    }

    public async broadcast(id: number | undefined, message: string) {
        await this._client.mutate({
            mutation: gql`
            mutation Broadcast($id: Int!, $message: String!) {
                broadcast(message: $message, id: $id)
              }
            `,
            variables: {
                id,
                message
            }
        })
    }

    public async getUser(id?: string) {
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

    public onFieldListUpdate(iframeId: number, cb: (portMappings: Server.IframeFieldPortMapping[]) => void) {
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
                iframeId,
            }
        }).subscribe(result => {
            cb(result.data.iframeFieldPortMappingList);
        });
    }


    public onBroadcastListUpdate(iframeId: number, cb: (portMappings: Server.IframeBroadcasterPortMapping[]) => void) {
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
        })
    }

    get ee() {
        return this._ee;
    }
}

