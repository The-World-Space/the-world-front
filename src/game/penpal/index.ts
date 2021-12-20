import * as Penpal from 'penpal';
import { Broadcaster, Field, IframeGameObject } from '../connect/types';
import { PenpalNetworkWrapper } from './PenpalNetworkWrapper';


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
    private internalFieldIdToFieldMap: Map<string, Field>;
    private internalBroadcasterIdToBroadcasterMap: Map<string, Broadcaster>;
    private publicFieldIdToInternalIdMap: Map<number, string>;
    private publicBroadcasterIdToInternalIdMap: Map<number, string>;
    private child!: Child;
    private subscriptions: ZenObservable.Subscription[];
    private disposeFuncs: (() => void)[] = [];

    constructor(
        private readonly iframe: HTMLIFrameElement,
        private readonly iframeInfo: IframeGameObject,
        private readonly penpalNetworkWrapper: PenpalNetworkWrapper) {
        this.internalFieldIdToFieldMap =
            new Map(iframeInfo.fieldPortMappings.map(({ portId, field }) => [portId, field]));
        this.publicFieldIdToInternalIdMap =
            new Map(iframeInfo.fieldPortMappings.map(({ portId, field }) => [field.id, portId]));
        this.internalBroadcasterIdToBroadcasterMap =
            new Map(iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [portId, broadcaster]));
        this.publicBroadcasterIdToInternalIdMap =
            new Map(iframeInfo.broadcasterPortMappings.map(({ portId, broadcaster }) => [broadcaster.id, portId]));
        this.subscriptions = [];
    }

    private internalFieldIdToPublicId(id: string) {
        return this.internalFieldIdToFieldMap.get(id)?.id;
    }
    private internalBroadcasterIdToPublicId(id: string) {
        return this.internalBroadcasterIdToBroadcasterMap.get(id)?.id;
    }
    private publicFieldIdToInternalId(id: number) {
        return this.publicFieldIdToInternalIdMap.get(id);
    }
    private publicBroadcasterIdToInternalId(id: number) {
        return this.publicBroadcasterIdToInternalIdMap.get(id);
    }


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
        this.internalFieldIdToFieldMap.forEach((field, internalId) => {
            const cb = (value: string, userId: string) => {
                this.child.setFieldValue(internalId, userId, value);
            };
            this.penpalNetworkWrapper.ee.on(`update_field_${field.id}`, cb);
            this.disposeFuncs.push(() => this.penpalNetworkWrapper.ee.removeListener(`update_field_${field.id}`, cb));
        });

        this.internalBroadcasterIdToBroadcasterMap.forEach((broadcaster, internalId) => {
            const cb = (message: string, userId: string) => {
                this.child.broadcast(internalId, userId, message);
            }
            this.penpalNetworkWrapper.ee.on(`update_broadcast_${broadcaster.id}`, cb);
            this.disposeFuncs.push(() => this.penpalNetworkWrapper.ee.removeListener(`update_broadcast_${broadcaster.id}`, cb));
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
                        }
                    }
                    for (const [internalId/*, _*/] of this.internalFieldIdToFieldMap) {
                        if (!existInternalIds.has(internalId)) {
                            this.internalFieldIdToFieldMap.delete(internalId);
                            this.child.deleteField(internalId);
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
                        }
                    }
                    for (const [internalId/*, _*/] of this.internalBroadcasterIdToBroadcasterMap) {
                        if (!existInternalIds.has(internalId)) {
                            this.internalBroadcasterIdToBroadcasterMap.delete(internalId);
                            this.child.deleteBroadcaster(internalId);
                        }
                    }
                }
            ),
        ];
    }

    private turnOffListeners() {
        this.disposeFuncs.forEach(f => f());
        for (const subscription of this.subscriptions)
            subscription.unsubscribe();
    }

    async stop() {
        this.turnOffListeners();
    }
}