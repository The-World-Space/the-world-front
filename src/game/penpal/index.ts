import { ApolloClient, gql } from "@apollo/client";
import * as Penpal from "penpal";

import { createIframeBroadcasterPortMapping, createIframeFieldPortMapping } from "../../components/organisms/EditorInner/IframeEditorInner";
import { Server } from "../connect/types";
import { PenpalNetworker } from "./PenpalNetworker";

interface Child {
    getPorts(): Promise<{ broadcasters: string[], fields: string[] }>;
    broadcast(id: string, userId: string, message: string): Promise<void>;
    setFieldValue(id: string, userId: string, value: string): Promise<void>;
    createField(fieldInfo: { id: string, value: string }): Promise<void>;
    deleteField(id: string): Promise<void>;
    createBroadcaster(broadcasterInfo: { id: string }): Promise<void>;
    deleteBroadcaster(id: string): Promise<void>;
}

export class IframeCommunicator {
    private internalFieldIdToFieldMap: Map<string, Server.Field>;
    private internalBroadcasterIdToBroadcasterMap: Map<string, Server.Broadcaster>;
    // private publicFieldIdToInternalIdMap: Map<number, string>;
    // private publicBroadcasterIdToInternalIdMap: Map<number, string>;
    private child!: Child;
    private subscriptions: ZenObservable.Subscription[];
    private fieldCbDisposeFuncs: Map<string, (() => void)> = new Map();
    private broadcasterCbDisposeFuncs: Map<string, (() => void)> = new Map();

    constructor(
        private readonly iframe: HTMLIFrameElement,
        private readonly iframeInfo: Server.PenpalConnectable,
        private readonly penpalNetworkWrapper: PenpalNetworker) {
        this.internalFieldIdToFieldMap =
            new Map(iframeInfo.fieldPortMappings.map(({ portId, field }) => [portId, field]));
        // this.publicFieldIdToInternalIdMap =
        //     new Map(iframeInfo.fieldPortMappings.map(({ portId, field }) => [field.id, portId]));
        this.internalBroadcasterIdToBroadcasterMap =
            new Map(iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [portId, broadcaster]));
        // this.publicBroadcasterIdToInternalIdMap =
        //     new Map(iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [broadcaster.id, portId]));
        this.subscriptions = [];
    }

    private internalFieldIdToPublicId(id: string) {
        return this.internalFieldIdToFieldMap.get(id)?.id;
    }
    private internalBroadcasterIdToPublicId(id: string) {
        return this.internalBroadcasterIdToBroadcasterMap.get(id)?.id;
    }
    // private publicFieldIdToInternalId(id: number) {
    //     return this.publicFieldIdToInternalIdMap.get(id);
    // }
    // private publicBroadcasterIdToInternalId(id: number) {
    //     return this.publicBroadcasterIdToInternalIdMap.get(id);
    // }


    /// <METHODS FOR IFRAME>
    private getFields() {
        return (
            [...this.internalFieldIdToFieldMap.entries()]
                .map(([internalId, field]) => ({ id: internalId, value: field.value, name: field.name }))
        );
    }
    private getField(id: string) {
        const field = this.internalFieldIdToFieldMap.get(id);

        if (!field)
            return null;

        return {
            id,
            value: field.value
        };
    }
    private async setFieldValue(internalId: string, value: string) {
        const publicId = this.internalFieldIdToPublicId(internalId);
        return await this.penpalNetworkWrapper.setFieldValue(publicId, value);
    }
    private getBroadcasters() {
        return (
            [...this.internalBroadcasterIdToBroadcasterMap.entries()]
                .map(([internalId, broadcaster]) => ({ id: internalId, name: broadcaster.name }))
        );
    }
    private getBroadcaster(id: string) {
        const broadcaster = this.internalBroadcasterIdToBroadcasterMap.get(id);

        if (!broadcaster)
            return null;

        return {
            id
        };
    }
    private async broadcast(internalId: string, message: string) {
        const publicId = this.internalBroadcasterIdToPublicId(internalId);
        return await this.penpalNetworkWrapper.broadcast(publicId, message);
    }
    private async getUser(id?: string) {
        return await this.penpalNetworkWrapper.getUser(id);
    }
    /// </METHODS FOR IFRAME>


    async apply(): Promise<void> {
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

        if("proto_" in this.iframeInfo)
            if((await this.penpalNetworkWrapper.getUser())!.id === this.iframeInfo.proto_?.owner.id)
                await this.tryAutoPortAdding();
    }

    private async tryAutoPortAdding() {
        const ports = await this.child.getPorts();
        const portsToAdd = {
            broadcasters: ports.broadcasters.filter(internalId => !this.internalBroadcasterIdToBroadcasterMap.has(internalId)),
            fields: ports.fields.filter(internalId => !this.internalFieldIdToFieldMap.has(internalId))
        };

        if(portsToAdd.broadcasters.length || portsToAdd.fields.length) {
            const shouldAdd = confirm(`Iframe ${this.iframeInfo.id} has not mapped ports. Automap it?`);
            if(shouldAdd) {
                this.addMapPorts(portsToAdd);
            }
        }
    }

    private async addMapPorts({ broadcasters, fields }: { broadcasters: string[], fields: string[] }) {
        const iframeId = this.iframeInfo.id;
        for(const internalId of broadcasters) {
            const id = await createLocalBroadcaster(this.penpalNetworkWrapper.client, iframeId, internalId);
            await createIframeBroadcasterPortMapping(this.penpalNetworkWrapper.client, iframeId, internalId, id);
        }
        for(const internalId of fields) {
            const id = await createLocalField(this.penpalNetworkWrapper.client, iframeId, internalId, "");
            await createIframeFieldPortMapping(this.penpalNetworkWrapper.client, iframeId, internalId, id);
        }
    }

    private turnOnFieldListener(publicId: number, internalId: string) {
        const cb = (value: string, userId: string) => {
            this.child.setFieldValue(internalId, userId, value);
        };
        this.penpalNetworkWrapper.ee.on(`update_field_${publicId}`, cb);
        this.fieldCbDisposeFuncs.set(internalId, () => this.penpalNetworkWrapper.ee.removeListener(`update_field_${publicId}`, cb));
    }
    private turnOffFieldListener(internalId: string) {
        this.fieldCbDisposeFuncs.get(internalId)?.();
    }

    private turnOnBroadcasterListener(publicId: number, internalId: string) {
        const cb = (message: string, userId: string) => {
            this.child.broadcast(internalId, userId, message);
        };
        this.penpalNetworkWrapper.ee.on(`update_broadcast_${publicId}`, cb);
        this.broadcasterCbDisposeFuncs.set(internalId, () => this.penpalNetworkWrapper.ee.removeListener(`update_broadcast_${publicId}`, cb));
    }
    private turnOffBroadcasterListener(internalId: string) {
        this.broadcasterCbDisposeFuncs.get(internalId)?.();
    }

    private turnOnListeners(): void {
        this.internalFieldIdToFieldMap.forEach((field, internalId) => {
            this.turnOnFieldListener(field.id, internalId);
        });

        this.internalBroadcasterIdToBroadcasterMap.forEach((broadcaster, internalId) => {
            this.turnOnBroadcasterListener(broadcaster.id, internalId);
        });

        this.subscriptions = [
            // Create / delete field
            this.penpalNetworkWrapper.onFieldListUpdate(
                this.iframeInfo.id,
                portMappings => {
                    const existInternalIds = new Set();

                    for (const portMapping of portMappings) {
                        existInternalIds.add(portMapping.portId);
                        if (!this.internalFieldIdToFieldMap.has(portMapping.portId)) {
                            const internalId = portMapping.portId;
                            this.internalFieldIdToFieldMap.set(internalId, portMapping.field);
                            this.child.createField({ id: internalId, value: portMapping.field.value });

                            // add listener
                            this.turnOnFieldListener(portMapping.field.id, internalId);
                        }
                    }
                    for (const [internalId/*, _*/] of this.internalFieldIdToFieldMap) {
                        if (!existInternalIds.has(internalId)) {
                            this.internalFieldIdToFieldMap.delete(internalId);
                            this.child.deleteField(internalId);
                            
                            this.turnOffFieldListener(internalId);
                        }
                    }
                }
            ),
            // Create / delete Broadcast
            this.penpalNetworkWrapper.onBroadcastListUpdate(
                this.iframeInfo.id,
                portMappings => {
                    const existInternalIds = new Set();
    
                    for (const portMapping of portMappings) {
                        existInternalIds.add(portMapping.portId);
                        if (!this.internalBroadcasterIdToBroadcasterMap.has(portMapping.portId)) {
                            const internalId = portMapping.portId;
                            this.internalBroadcasterIdToBroadcasterMap.set(internalId, portMapping.broadcaster);
                            this.child.createBroadcaster({ id: internalId });

                            // Add listener
                            this.turnOnBroadcasterListener(portMapping.broadcaster.id, internalId);
                        }
                    }
                    for (const [internalId/*, _*/] of this.internalBroadcasterIdToBroadcasterMap) {
                        if (!existInternalIds.has(internalId)) {
                            this.internalBroadcasterIdToBroadcasterMap.delete(internalId);
                            this.child.deleteBroadcaster(internalId);

                            this.turnOffBroadcasterListener(internalId);
                        }
                    }
                }
            )
        ];
    }

    private turnOffListeners(): void {
        for(const f of this.fieldCbDisposeFuncs.values()) f();
        for(const f of this.broadcasterCbDisposeFuncs.values()) f();
        for (const subscription of this.subscriptions)
            subscription.unsubscribe();
    }

    async stop(): Promise<void> {
        this.turnOffListeners();
    }
}

async function createLocalBroadcaster(apolloClient: ApolloClient<any>, iframeId: number, name: string) {
    const result = await apolloClient.mutate({
        mutation: gql`
        mutation CreateLocalBroadcaster($iframeId: Int!, $broadcaster: BroadcasterInput!) {
            createLocalBroadcaster(iframeId: $iframeId, broadcaster: $broadcaster) {
              id
            }
          }`,
        variables: {
            iframeId,
            broadcaster: {
                name
            }
        }
    });

    return result.data.createLocalBroadcaster.id as number;
}

async function createLocalField(apolloClient: ApolloClient<any>, iframeId: number, name: string, value: string) {
    const result = await apolloClient.mutate({
        mutation: gql`
        mutation CreateLocalField($iframeId: Int!, $field: FieldInput!) {
            createLocalField(iframeId: $iframeId, field: $field) {
              id
            }
          }
        `,
        variables: {
            iframeId,
            field: {
                name,
                value
            }
        }
    });

    return result.data.createLocalField.id as number;
}
