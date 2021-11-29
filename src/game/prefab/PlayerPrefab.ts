import { Vector2 } from "three";
import { CssSpriteAtlasRenderer } from "../component/render/CssSpriteAtlasRenderer";
import { SpriteAtlasAnimator } from "../component/render/SpriteAtlasAnimator";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchyObject/GameObject";
import { Prefab } from "../engine/hierarchyObject/Prefab";

export class PlayerPrefab extends Prefab {
    private _spriteAtlasPath: string = `${process.env.PUBLIC_URL}/assets/charactor/Subject1.png`;

    public with4x4SpriteAtlasFromPath(name: string): PlayerPrefab {
        this._spriteAtlasPath = name;
        return this;
    }

    public make(): GameObjectBuilder {
        //const instantlater = this._gameManager.instantlater;

        //let charactorAnimator: SpriteAtlasAnimator|null = null;

        return this._gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.setImage(this._spriteAtlasPath, 4, 4);
                c.imageCenterOffset = new Vector2(0, 50);
            })
            .withComponent(SpriteAtlasAnimator, c => {
                c.addAnimation("down_idle", [0]);
                c.addAnimation("right_idle", [4]);
                c.addAnimation("up_idle", [8]);
                c.addAnimation("left_idle", [12]);
                c.addAnimation("down_walk", [0, 1, 2, 3]);
                c.addAnimation("right_walk", [4, 5, 6, 7]);
                c.addAnimation("up_walk", [8, 9, 10, 11]);
                c.addAnimation("left_walk", [12, 13, 14, 15]);
                c.frameDuration = 0.2;
                //charactorAnimator = c;
            })
            .withComponent(ZaxisSorter, c => c.runOnce = false);
    }
}
