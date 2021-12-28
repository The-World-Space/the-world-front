export class Color {
    private readonly _r: number;
    private readonly _g: number;
    private readonly _b: number;
    private readonly _a: number;

    public constructor(r: number, g: number, b: number, a = 1) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    public get r(): number {
        return this._r;
    }

    public get g(): number {
        return this._g;
    }

    public get b(): number {
        return this._b;
    }

    public get a(): number {
        return this._a;
    }

    public toString(): string {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
    }

    public toHex(): string {
        return `#${this._r.toString(16)}${this._g.toString(16)}${this._b.toString(16)}`;
    }

    public toArray(): number[] {
        return [this._r, this._g, this._b, this._a];
    }

    public static fromHex(hex: string): Color {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return new Color(r, g, b);
    }

    public static fromArray(array: number[]): Color {
        return new Color(array[0], array[1], array[2], array[3]);
    }

    public static fromString(str: string): Color {
        const match = str.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/);
        if (match) {
            return new Color(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4]));
        }
        return Color.fromHex(str);
    }
}
