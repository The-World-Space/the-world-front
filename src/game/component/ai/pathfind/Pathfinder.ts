//use a star algorithm to find the shortest path

import { Vector2 } from "three";
import { IGridCollidable } from "../../physics/IGridCollidable";
import { PathNode } from "./PathNode";

export class Pathfinder {
    private static readonly moveCost: number = 10;
    private static readonly checkCollisionScale: number = 8;

    private collideMaps: IGridCollidable[];

    public constructor(collideMaps: IGridCollidable[]) {
        this.collideMaps = collideMaps.slice();
    }

    public findPath(startGridPosition: Vector2, endGridPosition: Vector2): Vector2[]|null {
        const startNode = new PathNode(startGridPosition.x, startGridPosition.y);
        const endNode = new PathNode(endGridPosition.x, endGridPosition.y);

        if (this.checkCollision(startNode.x, startNode.y)) return null; //start position is blocked
        if (this.checkCollision(endNode.x, endNode.y)) return null; //end position is blocked

        const openList: PathNode[] = [];
        const closedList: PathNode[] = [];
        
        openList.push(startNode);

        while (openList.length > 0) {
            const currentNode = this.getLowestFcostNode(openList);
            if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
                return this.calculatePath(currentNode);
            }
            openList.splice(openList.indexOf(currentNode), 1);
            closedList.push(currentNode);

            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    continue;
                }
                if (this.checkCollision(neighbor.x, neighbor.y)) {
                    closedList.push(neighbor);
                    continue;
                }
                const newCost = currentNode.gCost + this.calculateDistanceCost(currentNode, neighbor);
                if (newCost < neighbor.gCost || !openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    neighbor.gCost = newCost;
                    neighbor.hCost = this.calculateDistanceCost(neighbor, endNode);
                    neighbor.previousNode = currentNode;
                    if (!openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                        openList.push(neighbor);
                    }
                }
            }
        }
        return null;
    }

    private getNeighbors(node: PathNode): PathNode[] {
        const neighbors: PathNode[] = [];
        for (let y = node.y - 1; y <= node.y + 1; y++) {
            for (let x = node.x - 1; x <= node.x + 1; x++) {
                if (x === node.x && y === node.y) continue;
                if (this.checkCollision(x, y)) continue;
                neighbors.push(new PathNode(x, y));
            }
        }
        return neighbors;
    }

    private calculatePath(endNode: PathNode): Vector2[] {
        const path: Vector2[] = [];
        path.push(new Vector2(endNode.x, endNode.y));
        let currentNode = endNode;
        while (currentNode.previousNode !== null) {
            path.push(new Vector2(currentNode.x, currentNode.y));
            currentNode = currentNode.previousNode;
        }
        return path.reverse();
    }

    private calculateDistanceCost(a: PathNode, b: PathNode): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private getLowestFcostNode(openList: PathNode[]): PathNode {
        let lowestFcostNode: PathNode = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].fCost < lowestFcostNode.fCost) {
                lowestFcostNode = openList[i];
            }
        }
        return lowestFcostNode;
    }

    private checkCollision(x: number, y: number): boolean {
        for (const collideMap of this.collideMaps) {
            if (collideMap.checkCollision(
                x * collideMap.gridCellWidth + collideMap.gridCenterX,
                y * collideMap.gridCellHeight + collideMap.gridCenterY,
                Pathfinder.checkCollisionScale, Pathfinder.checkCollisionScale)
            ) {
                return true;
            }
        }
        return false;
    }
}
