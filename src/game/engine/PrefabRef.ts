export class PrefabRef<T> {
    public ref: T|null;

    public constructor(ref: T|null = null) {
        this.ref = ref;
    }
}
