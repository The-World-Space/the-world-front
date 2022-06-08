import { Component, IGridCollidable, PrefabRef } from "the-world-engine";
import { Vector2 } from "three";
import { NpcPlayerPrefab } from "../../prefab/NpcPlayerPrefab";
import { NpcController } from "../controller/NpcController";

export class NpcSpawner extends Component {
    public iGridCollidable: IGridCollidable | null = null;
    public npcList: NpcController[] = [];

    public createNPC(nameTag: string, gridPosition: Vector2|[number, number], atlasTextureSrc: string): NpcController {
        const npcController = new PrefabRef<NpcController>();

        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildPrefab(`npc_player_${nameTag}`, NpcPlayerPrefab)
                .withCollideMap(new PrefabRef(this.iGridCollidable))
                .withNameTag(new PrefabRef(nameTag))
                .withGridPosition(new PrefabRef(gridPosition instanceof Vector2 ? gridPosition : new Vector2(gridPosition[0], gridPosition[1])))
                .with4x4SpriteAtlasFromPath(new PrefabRef(atlasTextureSrc))
                .make()
                .getComponent(NpcController, npcController)
        );

        this.npcList.push(npcController.ref!);
        return npcController.ref!;
    }
}
