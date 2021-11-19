
import { ApolloClient, gql } from '@apollo/client';
import Penpal from 'penpal';
import { Broadcaster, IframeBroadcasterPortMapping, Field, IframeFieldPortMapping, GlobalField, IframeGameObject } from '../connect/types';


interface Child {
    getPorts(): Promise<{ broadcasters: string[], fields: string[] }>;
    broadcast(id: string, userId: string, message: string): Promise<void>;
    setFieldValue(id: string, userId: string, value: string): Promise<void>;
    createField(fieldInfo: { id: string, value: string }): Promise<void>;
    deleteField(id: string): Promise<void>;
    createBroadcaster(broadcasterInfo: { id: string }): Promise<void>;
    deleteBroadcaster(id: string): Promise<void>;
}

class IframeCommunicator {
    private internalFieldIdToFieldMap: Map<string, Field>;
    private internalBroadcasterIdToBroadcasterMap: Map<string, Broadcaster>;
    private child!: Child;
    private subscriptions: ZenObservable.Subscription[];

    constructor(
        private readonly apolloClient: ApolloClient<any>,
        private readonly iframe: HTMLIFrameElement,
        private readonly iframeInfo: IframeGameObject) {
            this.internalFieldIdToFieldMap = new Map(iframeInfo.fieldPortMappings.map(({ portId, field }) => [portId, field]));
            this.internalBroadcasterIdToBroadcasterMap = new Map(iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [portId, broadcaster]));
            this.subscriptions = [];
    }

    private internalFieldIdToPublicId(id: string) {
        return this.internalFieldIdToFieldMap.get(id)?.id;
    }
    private internalBroadcasterIdToPublicId(id: string) {
        return this.internalBroadcasterIdToBroadcasterMap.get(id)?.id;
    }
    private publicFieldIdToInternalId(id: number) {
        for(const [internalId, field] of this.internalFieldIdToFieldMap) {
            if(field.id === id)
                return internalId;
        }
    }
    private publicBroadcasterIdToInternalId(id: number) {
        for(const [internalId, broadcaster] of this.internalBroadcasterIdToBroadcasterMap) {
            if(broadcaster.id === id)
                return internalId;
        }
    }
    

    // FOR IFRAME~
    private getFields() {
        return [...this.internalFieldIdToFieldMap.entries()].map(([internalId, field]) => ({ id: internalId, value: field.value, name: field.name }));
    }
    private getField(id: string) {
        return this.internalFieldIdToFieldMap.get(id);
    }
    private async setFieldValue(id: string, value: string) {
        await this.apolloClient.mutate({
            mutation: gql`
            mutation SetFieldValue($id: Int!, $value: String!) {
                setFieldValue(id: $id, value: $value)
              }
            `,
            variables: {
                id: this.internalFieldIdToPublicId(id),
                value
            }
        });
    }
    private getBroadcasters() {
        return [...this.internalBroadcasterIdToBroadcasterMap.entries()].map(([internalId, broadcaster]) => ({ id: internalId, name: broadcaster.name }));
    }
    private getBroadcaster(id: string) {
        return this.internalBroadcasterIdToBroadcasterMap.get(id);
    }
    private async broadcast(id: string, message: string) {
        await this.apolloClient.mutate({
            mutation: gql`
            mutation Broadcast($id: Int!, $message: String!) {
                broadcast(message: $message, id: $id)
              }
            `,
            variables: {
                id: this.internalBroadcasterIdToPublicId(id),
                message
            }
        })
    }
    private async getUser(id?: string) {
        if(id === undefined) {
            const result = await this.apolloClient.query({
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
            const result = await this.apolloClient.query({
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
    //~


    async apply() {
        const connection = Penpal.connectToChild({
            iframe: this.iframe,
            methods: {
                getFields: this.getFields.bind(this),
                getField: this.getField.bind(this),
                setFieldValue: this.setFieldValue.bind(this),
                getBroadcasters: this.getBroadcasters.bind(this),
                getBroadcaster: this.getBroadcaster.bind(this),
                broadcast: this.broadcast.bind(this),
                getUser: this.getUser.bind(this)
            }
        });

        const child = await connection.promise;
        this.child = child as any;

        this.turnOnListeners();
    }
    private turnOnListeners() {
        this.subscriptions = [
            // Field
            this.apolloClient.subscribe({
                query: gql`
                    subscription FieldSetValue($worldId: String!) {
                        fieldSetValue(worldId: $worldId)
                    }
                `
            }).subscribe(result => {
                const { id, value, userId } = result.data.fieldSetValue as { id: number, value: string, userId: string };

                const internalId = this.publicFieldIdToInternalId(id);

                if(internalId)
                    this.child.setFieldValue(internalId, userId, value);
            }),
            // Broadcast
            this.apolloClient.subscribe({
                query: gql`
                    subscription BroadcastMessage($worldId: String!) {
                        broadcastMessage(worldId: $worldId)
                    }
                `
            }).subscribe(result => {
                const { id, message, userId } = result.data.broadcastMessage as { id: number, message: string, userId: string };

                const internalId = this.publicBroadcasterIdToInternalId(id);

                if(internalId)
                    this.child.broadcast(internalId, userId, message);
            }),
            // Create / delete field
            this.apolloClient.subscribe({
                query: gql`
                    subscription IframeFieldPortMappingList($iframeId: String!) {
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
                    iframeId: this.iframeInfo.id
                }
            }).subscribe(result => {
                const portMappings = result.data.iframeFieldPortMappingList as IframeFieldPortMapping[];

                const existInternalIds = new Set();

                for(const portMapping of portMappings) {
                    existInternalIds.add(portMapping.portId);
                    if(!this.internalFieldIdToFieldMap.has(portMapping.portId)) {
                        const internalId = portMapping.portId;
                        this.internalFieldIdToFieldMap.set(internalId, portMapping.field);
                        this.child.createField({ id: internalId, value: portMapping.field.value });
                    }
                }
                for(const [internalId, _] of this.internalFieldIdToFieldMap) {
                    if(!existInternalIds.has(internalId)) {
                        this.internalFieldIdToFieldMap.delete(internalId);
                        this.child.deleteField(internalId);
                    }
                }
            }),
            // Create / delete Broadcast
            this.apolloClient.subscribe({
                query: gql`
                    subscription IframeBroadcasterPortMappingList($iframeId: String!) {
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
                    iframeId: this.iframeInfo.id
                }
            }).subscribe(result => {
                const portMappings = result.data.iframeBroadcasterPortMappingList as IframeBroadcasterPortMapping[];

                const existInternalIds = new Set();

                for(const portMapping of portMappings) {
                    existInternalIds.add(portMapping.portId);
                    if(!this.internalBroadcasterIdToBroadcasterMap.has(portMapping.portId)) {
                        const internalId = portMapping.portId;
                        this.internalBroadcasterIdToBroadcasterMap.set(internalId, portMapping.broadcaster);
                        this.child.createBroadcaster({ id: internalId });
                    }
                }
                for(const [internalId, _] of this.internalBroadcasterIdToBroadcasterMap) {
                    if(!existInternalIds.has(internalId)) {
                        this.internalBroadcasterIdToBroadcasterMap.delete(internalId);
                        this.child.deleteBroadcaster(internalId);
                    }
                }
            }),
        ];
    }
    private turnOffListeners() {
        for(const subscription of this.subscriptions)
            subscription.unsubscribe();
    }

    async stop() {
        this.turnOffListeners();
    }
}