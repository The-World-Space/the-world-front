export class YieldInstruction { }

export class WaitForEndOfFrame extends YieldInstruction { 
    private static readonly _instance: WaitForEndOfFrame = new WaitForEndOfFrame();
    public get instance(): WaitForEndOfFrame { return WaitForEndOfFrame._instance; }
}

export class WaitForSeconds extends YieldInstruction {
    private readonly _seconds: number;
    public constructor(seconds: number) {
        super();
        this._seconds = seconds;
    }
    public get seconds(): number { return this._seconds; }
}

export class WaitUntil extends YieldInstruction {
    private readonly _predicate: () => boolean;
    public constructor(predicate: () => boolean) {
        super();
        this._predicate = predicate;
    }
    public get predicate(): () => boolean { return this._predicate; }
}

export class WaitWhile extends YieldInstruction {
    private readonly _predicate: () => boolean;
    public constructor(predicate: () => boolean) {
        super();
        this._predicate = predicate;
    }
    public get predicate(): () => boolean { return this._predicate; }
}
