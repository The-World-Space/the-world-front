import { ApolloClient, gql } from "@apollo/client";
import * as Penpal from "penpal";

import { createIframeBroadcasterPortMapping, createIframeFieldPortMapping } from "../../components/organisms/EditorInner/IframeEditorInner";
import { ProtoWebSocket } from "../../proto/ProtoWebSocket";
import * as pb from "../../proto/the_world";
import { Server } from "../connect/types";
import { PenpalNetworker } from "./PenpalNetworker";

interface Child {
    getPorts(): Promise<{ broadcasters: string[], fields: string[], plugins: { name: string, code: string, data: string }[] }>;
    broadcast(id: string, userId: string, message: string): Promise<void>;
    setFieldValue(id: string, userId: string, value: string): Promise<void>;
    sendPluginMessage(id: string, message: string): Promise<void>;
    createField(fieldInfo: { id: string, value: string }): Promise<void>;
    deleteField(id: string): Promise<void>;
    createBroadcaster(broadcasterInfo: { id: string }): Promise<void>;
    deleteBroadcaster(id: string): Promise<void>;
    createPlugin(pluginInfo: { id: string }): Promise<void>;
    deletePlugin(id: string): Promise<void>;
}

export class IframeCommunicator {
    private readonly _internalFieldIdToFieldMap: Map<string, Server.Field>;
    private readonly _internalBroadcasterIdToBroadcasterMap: Map<string, Server.Broadcaster>;
    private readonly _internalPluginIdToPluginMap: Map<string, { mappingId: number, plugin: Server.Plugin }>;
    // private _publicFieldIdToInternalIdMap: Map<number, string>;
    // private _publicBroadcasterIdToInternalIdMap: Map<number, string>;
    private _child!: Child;
    private _subscriptions: ZenObservable.Subscription[];
    private _pluginsListenerDisposeFuncs: (() => void)[];
    private readonly _fieldCbDisposeFuncs: Map<string, (() => void)> = new Map();
    private readonly _broadcasterCbDisposeFuncs: Map<string, (() => void)> = new Map();
    private readonly _pluginCbDisposeFuncs: Map<string, (() => void)> = new Map();

    public constructor(
        private readonly _iframe: HTMLIFrameElement,
        private readonly _iframeInfo: Server.PenpalConnectable,
        _pluginPortMappings: Server.PluginPortMapping[],
        private readonly _penpalNetworkWrapper: PenpalNetworker
    ) {
        this._internalFieldIdToFieldMap =
            new Map(_iframeInfo.fieldPortMappings.map(({ portId, field }) => [portId, field]));
        // this.publicFieldIdToInternalIdMap =
        //     new Map(iframeInfo.fieldPortMappings.map(({ portId, field }) => [field.id, portId]));
        this._internalBroadcasterIdToBroadcasterMap =
            new Map(_iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [portId, broadcaster]));
        // this.publicBroadcasterIdToInternalIdMap =
        //     new Map(iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [broadcaster.id, portId]));
        this._internalPluginIdToPluginMap =
            new Map(_pluginPortMappings.map(({ id, portId, plugin }) => [portId, { mappingId: id, plugin }]));
        this._subscriptions = [];
        this._pluginsListenerDisposeFuncs = [];
    }

    private internalFieldIdToPublicId(id: string): number|undefined {
        return this._internalFieldIdToFieldMap.get(id)?.id;
    }
    
    private internalBroadcasterIdToPublicId(id: string): number|undefined {
        return this._internalBroadcasterIdToBroadcasterMap.get(id)?.id;
    }

    private internalPluginIdToPublicId(id: string): number|undefined {
        return this._internalPluginIdToPluginMap.get(id)?.plugin.id;
    }

    // private publicFieldIdToInternalId(id: number) {
    //     return this.publicFieldIdToInternalIdMap.get(id);
    // }
    // private publicBroadcasterIdToInternalId(id: number) {
    //     return this.publicBroadcasterIdToInternalIdMap.get(id);
    // }


    /// <METHODS FOR IFRAME>
    private getFields(): { id: string; value: string; name: string; }[] {
        return (
            [...this._internalFieldIdToFieldMap.entries()]
                .map(([internalId, field]) => ({ id: internalId, value: field.value, name: field.name }))
        );
    }

    private getField(id: string): { id: string; value: string; } | null {
        const field = this._internalFieldIdToFieldMap.get(id);

        if (!field) return null;

        return {
            id,
            value: field.value
        };
    }
    
    private async setFieldValue(internalId: string, value: string): Promise<void> {
        const publicId = this.internalFieldIdToPublicId(internalId);
        if (publicId === undefined) return;
        return await this._penpalNetworkWrapper.setFieldValue(publicId, value);
    }

    private getBroadcasters(): { id: string; name: string; }[] {
        return (
            [...this._internalBroadcasterIdToBroadcasterMap.entries()]
                .map(([internalId, broadcaster]) => ({ id: internalId, name: broadcaster.name }))
        );
    }

    private getBroadcaster(id: string): { id: string; } | null {
        const broadcaster = this._internalBroadcasterIdToBroadcasterMap.get(id);

        if (!broadcaster)
            return null;

        return {
            id
        };
    }

    private async broadcast(internalId: string, message: string): Promise<void> {
        const publicId = this.internalBroadcasterIdToPublicId(internalId);
        if (publicId === undefined) return;
        return await this._penpalNetworkWrapper.broadcast(publicId, message);
    }

    private getPlugin(_: string): { id: string } | null {
        return null;
    }

    private async sendPluginMessage(internalId: string, message: string) {
        const publicId = this.internalPluginIdToPublicId(internalId);
        if (publicId === undefined) return;
        return await this._penpalNetworkWrapper.sendPluginMessage(publicId, message);
    }

    private async getUser(id?: string): Promise<Server.User | null> {
        return await this._penpalNetworkWrapper.getUser(id);
    }
    /// </METHODS FOR IFRAME>

    public async apply(): Promise<void> {
        const connection = Penpal.connectToChild({
            iframe: this._iframe,
            methods: {
                getFields: this.getFields.bind(this),
                getField: this.getField.bind(this),
                setFieldValue: this.setFieldValue.bind(this),
                getBroadcasters: this.getBroadcasters.bind(this),
                getBroadcaster: this.getBroadcaster.bind(this),
                broadcast: this.broadcast.bind(this),
                getPlugin: this.getPlugin.bind(this),
                sendPluginMessage: this.sendPluginMessage.bind(this),
                getUser: this.getUser.bind(this)
            }
        });

        const child = await connection.promise;
        this._child = child as any;
        this.turnOnListeners();

        if("proto_" in this._iframeInfo)
            if((await this._penpalNetworkWrapper.getUser())!.id === this._iframeInfo.proto_?.owner.id) {
                await this.tryPluginUpdating();
                await this.tryAutoPortAdding();
            }
    }

    private async tryPluginUpdating() {
        const ports = await this._child.getPorts();

        const pluginsToCheck = ports.plugins.filter(({ name }) => this._internalPluginIdToPluginMap.has(name));

        const pluginIdsToUpdate = await getPluginIdsToUpdate(
            this._penpalNetworkWrapper.protoClient,
            pluginsToCheck.filter(({ code }) => code !== "").map(({ name, code }) => ({ id: this._internalPluginIdToPluginMap.get(name)!.plugin.id, code }))
        );

        {
            const pluginInternalIdsNotToUpdate = pluginsToCheck
                .filter(({ name }) => !pluginIdsToUpdate.includes(this._internalPluginIdToPluginMap.get(name)!.plugin.id))
                .map(({ name }) => name);

            for(const internalId of pluginInternalIdsNotToUpdate) {
                this._child.createPlugin({ id: internalId });
            }
        }

        const pluginsToUpdate = pluginsToCheck.filter(({ name }) => pluginIdsToUpdate.includes(this._internalPluginIdToPluginMap.get(name)!.plugin.id));

        if(pluginIdsToUpdate.length) {
            const shouldUpdate = confirm(`Iframe ${this._iframeInfo.id} has plugin to update. Update it?`);
            if(shouldUpdate) {
                this.updatePlugins(pluginsToUpdate);
            } else {
                for(const plugin of pluginsToUpdate) {
                    const internalId = plugin.name;
                    this._child.createPlugin({ id: internalId });
                }
            }
        }
    }

    private async updatePlugins(plugins: { name: string, code: string, data: string }[]) {
        const protoClient = this._penpalNetworkWrapper.protoClient;
        const iframeId = this._iframeInfo.id;
        for(const plugin of plugins) {
            deletePlugin(protoClient, this._internalPluginIdToPluginMap.get(plugin.name)!.plugin.id);
            const id = await createLocalPlugin(protoClient, iframeId, plugin.name, plugin.code, plugin.data);
            await createIframePluginPortMapping(protoClient, iframeId, plugin.name, id);
        }
    }

    private async tryAutoPortAdding(): Promise<void> {
        const ports = await this._child.getPorts();

        if(!ports.plugins) ports.plugins = [];

        const portsToAdd = {
            broadcasters: ports.broadcasters.filter(internalId => !this._internalBroadcasterIdToBroadcasterMap.has(internalId)),
            fields: ports.fields.filter(internalId => !this._internalFieldIdToFieldMap.has(internalId)),
            plugins: ports.plugins.filter(({ name }) => !this._internalPluginIdToPluginMap.has(name))
        };

        if(portsToAdd.broadcasters.length || portsToAdd.fields.length) {
            const shouldAdd = confirm(`Iframe ${this._iframeInfo.id} has not mapped ports. Automap it?`);
            if(shouldAdd) {
                this.addMapPorts(portsToAdd);
            }
        }

        if(portsToAdd.plugins.length) {
            const shouldAdd = confirm(`Iframe ${this._iframeInfo.id} has not mapped plugins. Add plugin and automap it?`);
            if(shouldAdd) {
                this.addPluginPorts(portsToAdd.plugins);
            }
        }
    }

    private async addMapPorts({ broadcasters, fields }: { broadcasters: string[], fields: string[] }): Promise<void> {
        const iframeId = this._iframeInfo.id;
        for(const internalId of broadcasters) {
            const id = await createLocalBroadcaster(this._penpalNetworkWrapper.client, iframeId, internalId);
            await createIframeBroadcasterPortMapping(this._penpalNetworkWrapper.client, iframeId, internalId, id);
        }
        for(const internalId of fields) {
            const id = await createLocalField(this._penpalNetworkWrapper.client, iframeId, internalId, "");
            await createIframeFieldPortMapping(this._penpalNetworkWrapper.client, iframeId, internalId, id);
        }
    }

    private async addPluginPorts(plugins: { name: string, code: string, data: string }[]) {
        const iframeId = this._iframeInfo.id;
        for(const plugin of plugins) {
            const id = await createLocalPlugin(this._penpalNetworkWrapper.protoClient, iframeId, plugin.name, plugin.code, plugin.data);
            await createIframePluginPortMapping(this._penpalNetworkWrapper.protoClient, iframeId, plugin.name, id);
        }
    }

    private turnOnFieldListener(publicId: number, internalId: string): void {
        const cb = (value: string, userId: string): void => {
            this._child.setFieldValue(internalId, userId, value);
        };
        this._penpalNetworkWrapper.ee.on(`update_field_${publicId}`, cb);
        this._fieldCbDisposeFuncs.set(internalId, () => this._penpalNetworkWrapper.ee.removeListener(`update_field_${publicId}`, cb));
    }

    private turnOffFieldListener(internalId: string): void {
        this._fieldCbDisposeFuncs.get(internalId)?.();
    }

    private turnOnBroadcasterListener(publicId: number, internalId: string): void {
        const cb = (message: string, userId: string): void => {
            this._child.broadcast(internalId, userId, message);
        };
        this._penpalNetworkWrapper.ee.on(`update_broadcast_${publicId}`, cb);
        this._broadcasterCbDisposeFuncs.set(internalId, () => this._penpalNetworkWrapper.ee.removeListener(`update_broadcast_${publicId}`, cb));
    }

    private turnOffBroadcasterListener(internalId: string): void {
        this._broadcasterCbDisposeFuncs.get(internalId)?.();
    }

    private turnOnPluginListener(publicId: number, internalId: string): void {
        const cb = (message: string): void => {
            this._child.sendPluginMessage(internalId, message);
        };
        this._penpalNetworkWrapper.ee.on(`plugin_message_sent_${publicId}`, cb);
        this._pluginCbDisposeFuncs.set(internalId, () => this._penpalNetworkWrapper.ee.removeListener(`plugin_message_sent_${publicId}`, cb));
    }

    private turnOffPluginListener(internalId: string): void {
        this._pluginCbDisposeFuncs.get(internalId)?.();
    }

    private turnOnListeners(): void {
        this._internalFieldIdToFieldMap.forEach((field, internalId) => {
            this.turnOnFieldListener(field.id, internalId);
        });

        this._internalBroadcasterIdToBroadcasterMap.forEach((broadcaster, internalId) => {
            this.turnOnBroadcasterListener(broadcaster.id, internalId);
        });

        this._internalPluginIdToPluginMap.forEach((plugin, internalId) => {
            this.turnOnPluginListener(plugin.plugin.id, internalId);
        });

        this._subscriptions = [
            // Create / delete field
            this._penpalNetworkWrapper.onFieldListUpdate(
                this._iframeInfo.id,
                portMappings => {
                    const existInternalIds = new Set();

                    for (const portMapping of portMappings) {
                        existInternalIds.add(portMapping.portId);
                        if (!this._internalFieldIdToFieldMap.has(portMapping.portId)) {
                            const internalId = portMapping.portId;
                            this._internalFieldIdToFieldMap.set(internalId, portMapping.field);
                            this._child.createField({ id: internalId, value: portMapping.field.value });

                            // add listener
                            this.turnOnFieldListener(portMapping.field.id, internalId);
                        }
                    }
                    for (const [internalId/*, _*/] of this._internalFieldIdToFieldMap) {
                        if (!existInternalIds.has(internalId)) {
                            this._internalFieldIdToFieldMap.delete(internalId);
                            this._child.deleteField(internalId);
                            
                            this.turnOffFieldListener(internalId);
                        }
                    }
                }
            ),
            // Create / delete Broadcast
            this._penpalNetworkWrapper.onBroadcastListUpdate(
                this._iframeInfo.id,
                portMappings => {
                    const existInternalIds = new Set();
    
                    for (const portMapping of portMappings) {
                        existInternalIds.add(portMapping.portId);
                        if (!this._internalBroadcasterIdToBroadcasterMap.has(portMapping.portId)) {
                            const internalId = portMapping.portId;
                            this._internalBroadcasterIdToBroadcasterMap.set(internalId, portMapping.broadcaster);
                            this._child.createBroadcaster({ id: internalId });

                            // Add listener
                            this.turnOnBroadcasterListener(portMapping.broadcaster.id, internalId);
                        }
                    }
                    for (const [internalId/*, _*/] of this._internalBroadcasterIdToBroadcasterMap) {
                        if (!existInternalIds.has(internalId)) {
                            this._internalBroadcasterIdToBroadcasterMap.delete(internalId);
                            this._child.deleteBroadcaster(internalId);

                            this.turnOffBroadcasterListener(internalId);
                        }
                    }
                }
            )
        ];

        this._pluginsListenerDisposeFuncs.push(
            this._penpalNetworkWrapper.onPluginPortMappingCreated(this._iframeInfo.id, portMapping => {
                if (!this._internalPluginIdToPluginMap.has(portMapping.portId)) {
                    const internalId = portMapping.portId;
                    this._internalPluginIdToPluginMap.set(internalId, { mappingId: portMapping.id, plugin: portMapping.plugin });
                    this._child.createPlugin({ id: internalId });
    
                    // Add listener
                    this.turnOnPluginListener(portMapping.plugin.id, internalId);
                }
            }),
            this._penpalNetworkWrapper.onPluginPortMappingDeleted(this._iframeInfo.id, id => {
                const pluginMapping = [...this._internalPluginIdToPluginMap.entries()].find(([_,pluginMapping]) => pluginMapping.mappingId === id);
                if(pluginMapping) {
                    const internalId = pluginMapping[0];
                    this._internalPluginIdToPluginMap.delete(internalId);
                    this._child.deleteBroadcaster(internalId);

                    this.turnOffPluginListener(internalId);
                }
            })
        );
    }

    private turnOffListeners(): void {
        for(const f of this._fieldCbDisposeFuncs.values()) f();
        for(const f of this._broadcasterCbDisposeFuncs.values()) f();
        for(const f of this._pluginCbDisposeFuncs.values()) f();
        for (const subscription of this._subscriptions)
            subscription.unsubscribe();
    }

    public async stop(): Promise<void> {
        this.turnOffListeners();
    }
}

async function createLocalBroadcaster(apolloClient: ApolloClient<any>, iframeId: number, name: string): Promise<number> {
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

async function createLocalField(apolloClient: ApolloClient<any>, iframeId: number, name: string, value: string): Promise<number> {
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

function createLocalPlugin(client: ProtoWebSocket<pb.ServerEvent>, iframeId: number, name: string, code: string, data: string): Promise<number> {
    return new Promise(solve => {
        client.send(new pb.ClientEvent({
            createPlugin: new pb.CreatePlugin({
                isLocal: true,
                iframeId: iframeId,
                name: name,
                code: code,
                data: data
            })
        }));

        const listener = (serverEvent: pb.ServerEvent) => {
            if(serverEvent.has_localPluginCreated) {
                const e = serverEvent.localPluginCreated;

                if(e.iframeId === iframeId && e.name === name) {
                    solve(e.id);
                    client.removeListener("message", listener);
                }
            }
        };

        client.on("message", listener);
    });
}

function createIframePluginPortMapping(client: ProtoWebSocket<pb.ServerEvent>, iframeId: number, portId: string, pluginId: number): Promise<number> {
    return new Promise(solve => {
        client.send(new pb.ClientEvent({
            createIframePluginPortMapping: new pb.CreateIframePluginPortMapping({
                iframeId: iframeId,
                portId: portId,
                pluginId: pluginId
            })
        }));

        const listener = (serverEvent: pb.ServerEvent) => {
            if(serverEvent.has_iframePluginPortMappingCreated) {
                const e = serverEvent.iframePluginPortMappingCreated;

                if(e.iframeId === iframeId && e.pluginId === pluginId && e.portId === portId) {
                    solve(e.id);
                    client.removeListener("message", listener);
                }
            }
        };

        client.on("message", listener);
    });
}

let reqId = 0;
function getPluginIdsToUpdate(client: ProtoWebSocket<pb.ServerEvent>, pluginInfos: { id: number, code: string }[]): Promise<number[]> {
    return new Promise(solve => {
        const myReqId = ++reqId;
        client.send(new pb.ClientEvent({
            reqIsPluginsOutdated: new pb.ReqIsPluginsOutdated({
                pluginInfos: pluginInfos.map(({id, code}) => new pb.ReqIsPluginsOutdated.PluginInfo({ id, code })),
                id: myReqId
            })
        }));

        const listener = (serverEvent: pb.ServerEvent) => {
            if(serverEvent.has_resIsPluginOutdated) {
                const e = serverEvent.resIsPluginOutdated;

                if(e.id === myReqId) {
                    const pluginIdsToUpdate = [];
                    for(let i = 0; i < e.isOutdateds.length; i++){
                        if(e.isOutdateds[i]) {
                            pluginIdsToUpdate.push(pluginInfos[i].id);
                        }
                    }
                    solve(pluginIdsToUpdate);
                    client.removeListener("message", listener);
                }
            }
        };

        client.on("message", listener);
    });
}

function deletePlugin(client: ProtoWebSocket<pb.ServerEvent>, pluginId: number): void {
    client.send(new pb.ClientEvent({
        deletePlugin: new pb.DeletePlugin({
            id: pluginId
        })
    }));
}