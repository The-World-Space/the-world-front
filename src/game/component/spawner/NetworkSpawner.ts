import { Vector2 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { NetworkManager, User } from "../../engine/NetworkManager";
import { NetworkPlayerPrefab } from "../../prefab/NetworkPlayerPrefab";

const prefix = `@@tw/game/component/spawner/NetworkSpawnner`

export class NetworkSpawner extends Component {
    public initNetwork(networkManager: NetworkManager) {
        networkManager.ee.on('join', (user, pos) => {
            this._buildNetwrokPlayer(user, pos, networkManager);
        });
    }

    private _buildNetwrokPlayer(user: User, pos: Vector2, networkManager: NetworkManager) {
        const instantlater = this.engine.instantlater;

        const prefab = 
            instantlater.buildPrefab(`${prefix}/player_${user.id}`, NetworkPlayerPrefab)
                .withUserId(user.id)
                .withNetworkManager(networkManager)
                
        this.gameObject.addChildFromBuilder(prefab.make());
    }
}
