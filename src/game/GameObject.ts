import { Object3D, Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";

export class GameObject extends Object3D {
    private _components: (Component|null)[] = [];

    public constructor() {
        super();
    }

    public addComponent(componentCtor: ComponentConstructor) {
        const component = new componentCtor(this);
        let pushedAtIteration = false;
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === null) {
                this._components[i] = component;
                pushedAtIteration = true;
                break;
            }
        }
        if (!pushedAtIteration) this._components.push(component);
    }

    public getComponents(): Component[] {
        return this._components.filter(c => c !== null) as Component[];
    }

    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        for (const c of this._components) {
            if (c instanceof componentCtor) return c;
        }
        return null;
    }
    
    public update() {
        let componentLength = this._components.length;
        for (let i = 0; i < componentLength; i++) {
            this._components[i]?.update();
        }
    }

    public destroy() {
        for (const component of this._components) {
            component?.destroy();
        }
        this.parent = null;
    }

    public static readonly GameObjectBuilder = class GameObjectBuilder{
        private readonly gameObject: GameObject;
        private readonly children: GameObjectBuilder[];
        private readonly componentInitializeFuncList: (() => void)[];

        public constructor();

        public constructor(localPosition?: Vector3);

        public constructor(localPosition?: Vector3, localRotation?: Quaternion);
        
        public constructor(localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
            this.gameObject = new GameObject();
            if (localPosition) this.gameObject.position.copy(localPosition);
            if (localRotation) this.gameObject.quaternion.copy(localRotation);
            if (localScale) this.gameObject.scale.copy(localScale);
            this.children = [];
            this.componentInitializeFuncList = [];
        }

        public withComponent<T extends Component>(componentCtor: ComponentConstructor<T>): GameObjectBuilder;
    
        public withComponent<T extends Component>(
            componentCtor: ComponentConstructor<T>,
            componentInitializeFunc?: (component: T) => void
        ): GameObjectBuilder {
            const component = new componentCtor(this.gameObject);
            this.gameObject._components.push(component);
            if (componentInitializeFunc) {
                this.componentInitializeFuncList.push(() => componentInitializeFunc(component));
            }
            return this;
        }

        public withChild(child: GameObject): GameObjectBuilder {
            this.children.push(new GameObjectBuilder(child));
            return this;
        }
    }
}
