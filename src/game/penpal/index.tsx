
import Penpal from 'penpal';



function applyToIframe(iframe: HTMLIframeElement) {
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