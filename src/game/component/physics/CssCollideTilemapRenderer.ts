import { CssTilemapRenderer } from "../render/CssTilemapRenderer";

export class CssCollideTilemapRenderer extends CssTilemapRenderer {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();

    public drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void {
        super.drawTile(column, row, imageIndex, atlasIndex);
        this._collideMap.set(`${column}_${row}`, true);
    }

    public drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], columnOffset: number, rowOffset: number): void {
        super.drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset);
        for (let row = 0; row < array.length; row++) {
            for (let column = 0; column < array[row].length; column++) {
                if (array[row][column] !== null) {
                    //console.log(`${(column + columnOffset) - this.columnCount / 2}_${(this.rowCount - (row + rowOffset)) - this.rowCount / 2}`);
                    this._collideMap.set(
                        `${Math.ceil((column + columnOffset) - this.columnCount / 2)}_${Math.ceil((this.rowCount - (row + rowOffset)) - this.rowCount / 2)}`, true);
                    // this.addDebugImage(
                    //     ((column + columnOffset) - this.columnCount / 2) * this.tileWidth + this.tileWidth / 2,
                    //     ((this.rowCount - (row + rowOffset)) - this.rowCount / 2) * this.tileHeight - this.tileHeight / 2
                    // );
                }
            }
        }
    }

    // private addDebugImage(x: number, y: number) {
    //     if (this.gameObject.parent instanceof GameObject) {
    //         this.gameObject.parent.addChildFromBuilder(
    //             this.gameManager.instantlater.buildGameObject("debugImage", new Vector3(x, y, 10000))
    //                 .withComponent(ZaxisInitializer)
    //                 .withComponent(CssSpriteRenderer));
    //     }
    // }

    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (this.rowCount % 2 === 0) y += this.tileHeight / 2;
        if (this.columnCount % 2 === 0)  x += this.tileWidth / 2;

        const left = Math.floor(x / this.tileWidth);
        const right = Math.floor((x + width) / this.tileWidth);
        const top = Math.floor(y / this.tileHeight);
        const bottom = Math.floor((y + height) / this.tileHeight);
        for (let row = top; row <= bottom; row++) {
            for (let column = left; column <= right; column++) {
                if (this._collideMap.get(`${column}_${row}`) === true) {
                    return true;
                }
            }
        }
        return false;
    }
}
