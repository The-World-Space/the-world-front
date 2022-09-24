export class TaskBuffer {
    private _taskQueue: (() => void)[] = [];
    private _processingAsyncTask = false;

    public addTask(task: () => void): void {
        this._taskQueue.push(task);
    }

    public addAsyncTask(task: (resolve: () => void) => void): void {
        this._taskQueue.push(() => {
            this._processingAsyncTask = true;
            task(() => {
                this._processingAsyncTask = false;
            });
        });
    }

    public update(): boolean {
        if (this._taskQueue.length > 0 && !this._processingAsyncTask) {
            const task = this._taskQueue.shift();
            if (task !== undefined) {
                task();
            }
            return true;
        }
        return false;
    }
}
