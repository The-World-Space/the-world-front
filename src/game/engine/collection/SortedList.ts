export class SortedList<T> {
    private _compartor: (a: T, b: T) => number;
    private _list: T[];
    
    public constructor(compartor: (a: T, b: T) => number) {
        this._compartor = compartor;
        this._list = [];
    }

    public get length(): number {
        return this._list.length;
    }

    public get(index: number): T {
        return this._list[index];
    }

    //it must not be called when iterating the list
    public add(item: T): void {
        const index = this.binarySearch(item);
        this._list.splice(index, 0, item);
    }

    //it must not be called when iterating the list
    public addItems(items: T[]): void {
        this._list.push(...items);
        this._list.sort(this._compartor);
    }

    //it must not be called when iterating the list
    public remove(item: T): void {
        const index = this.binarySearch(item);
        this._list.splice(index, 1);
    }

    public binarySearch(item: T): number {
        let low = 0;
        let high = this._list.length - 1;
        while (low <= high) {
            const middle = Math.floor((low + high) / 2);
            const comp = this._compartor(item, this._list[middle]);
            if (comp < 0) {
                high = middle - 1;
            } else if (comp > 0) {
                low = middle + 1;
            } else {
                return middle;
            }
        }
        return low;
    }

    public clear(): void {
        this._list.length = 0;
    }

    public forEach(callback: (item: T) => void): void {
        for (const item of this._list) {
            callback(item);
        }
    }
}
