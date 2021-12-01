import { Quaternion, Vector3 } from "three";
import { GameManager } from "../GameManager";
import { Prefab } from "./Prefab";

export type PrefabConstructor<T extends Prefab = Prefab> = new (
    gameManager: GameManager,
    name: string,
    localPosition?: Vector3,
    localRotation?: Quaternion,
    localScale?: Vector3
) => T;
