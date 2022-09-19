import { ApolloClient, gql } from "@apollo/client";
import { DumbTypedEmitter } from "detail-typed-emitter";

import { Server } from "../../connect/types";

type DEETypes = {
    "amI": () => void,
    "amnt": () => void,
}

export class AdminNetworker {
    private readonly _dee: DumbTypedEmitter<DEETypes>;

    public constructor(private readonly _userId: string,
                private readonly _worldId: string,
                private readonly _client: ApolloClient<any>) {
        this._dee = new DumbTypedEmitter<DEETypes>();
        this._initNetwork();
        // this._initEEListenters();
    }

    private _initNetwork(): void {
        this._client.query({
            query: gql`
                query World($id: String!) {
                    World(id: $id) {
                        amIAdmin
                        amIOwner
                    }
                }
            `,
            variables: {
                id: this._worldId
            }
        }).then(data => {
            if (!data.data.World) throw new Error("data.data.World is falsy");
            const world = data.data.World as Server.World;
            const isAdmin = world.amIAdmin || world.amIOwner;
            if (isAdmin)
                this._dee.emit("amI");
            else
                this._dee.emit("amnt");
        });


        this._client.subscribe({
            query: gql`
                subscription worldAdminList($worldId: String!) {
                    worldAdminList(worldId: $worldId) {
                        id
                        nickname
                        skinSrc
                    }
                }
            `,
            variables: {
                worldId: this._worldId
            }
        }).subscribe(data => {
            if (!data.data.worldAdminList) throw new Error("data.data.iframeGameObjectCreating is falsy");
            const admins = data.data.worldAdminList as Server.User[];
            
            if (admins.find(admin => admin.id === this._userId))
                this._dee.emit("amI");
            else
                this._dee.emit("amnt");
        });
    }

    public get ee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}
