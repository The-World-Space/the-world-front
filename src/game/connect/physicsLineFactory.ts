import { Direction } from "../../core/types/Base";


interface physicsLine {
    x: number;
    y: number;
    direction: Direction;
}

export function physicsLineFactory(height: number, width: number, physicsLines: physicsLine[]) {
    let res = new Array(height + 1).fill(0)
                 .map(() => new Array(2 * width + 1).fill(false));

    function setTrue(x: number, y: number, direction: Direction) {
        const list_dy = [NaN, 0, 1, 0, 0];
        const list_dx = [NaN, 0, 0, -1, 1];

        const dy = list_dy[direction];
        const dx = list_dx[direction];

        res[y + dy][2 * x + dx + 1] = true;
    }
    

    physicsLines.forEach(({ x, y, direction }) => {
        setTrue(x, y, direction);
    });

    return res;
}
