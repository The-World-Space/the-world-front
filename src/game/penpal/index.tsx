
import { ApolloClient } from '@apollo/client';
import Penpal from 'penpal';
import { GlobalField, IframeGameObject } from '../connect/types';

class IframeCommunicator {
    constructor(
        private readonly apolloClient: ApolloClient,
        private readonly iframe: HTMLIframeElement,
        private readonly globalFields: GlobalField[],
        private readonly iframeInfo: IframeGameObject) {
        
    }

    private setFieldValue() {
        this.apolloClient.mutate({
            mutation:
        })
    }

    async apply() {
        const self = this;

        const connection = Penpal.connectToChild({
            iframe,
            methods: {
                getFields() {
    
                },
                getField(id: string) {
    
                },
                getFieldValue(id: string) {
    
                },
                setFieldValue(id: string, value: string) {

                },
    
                getBroadcasters() {
    
                },
                getBroadcaster(id: string) {
    
                },
                broadcast(id: string, message: string) {
    
                },
    
                getUser(id?: string) {
    
                }
            }
        });
    }
}

function applyToIframe(apolloClient: ApolloClient, iframe: HTMLIframeElement, iframeGameObjectId: string) {
    const iframeIdToPortIdToFieldIdMap: Map<number, Map<string, number>>;

}