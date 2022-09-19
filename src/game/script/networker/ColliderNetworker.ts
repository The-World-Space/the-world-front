import { ApolloClient, gql } from "@apollo/client";
import { DumbTypedEmitter } from "detail-typed-emitter";

import { Server } from "../../connect/types";

type DEETypes = {
    "update" : (collider: Server.Collider) => void,
}

export class ColliderNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    constructor(private readonly _worldId: string,
                private readonly _client: ApolloClient<any>) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this._initNetwork();
        // this._initEEListenters();
    }

    private _initNetwork() {
        this._client.subscribe({
            query: gql`
                subscription ColliderUpdating($worldId: String!) {
                    colliderUpdating(worldId: $worldId) {
                        x
                        y
                        isBlocked
                    }
                }
            `,
            variables: {
                worldId: this._worldId
            }
        }).subscribe(data => {
            if (!data.data.colliderUpdating) throw new Error("data.data.iframeGameObjectCreating is falsy");
            const collider = data.data.colliderUpdating as Server.Collider;
            
            this._dee.emit("update", collider);
        });
    }

    get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}
