import { TileMap } from "./TileMap";
import type { TileCoord } from "../types";

export class PathGraph {
  private tileMap: TileMap;

  constructor(tileMap: TileMap) {
    this.tileMap = tileMap;
  }

  getNeighbors(col: number, row: number): TileCoord[] {
    return this.tileMap.getPathNeighbors(col, row);
  }

  isWalkable(col: number, row: number): boolean {
    return this.tileMap.isWalkable(col, row);
  }

  findNearestPath(col: number, row: number): TileCoord | null {
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dc, dr] of dirs) {
      if (this.tileMap.isPath(col + dc, row + dr)) {
        return { col: col + dc, row: row + dr };
      }
    }
    return null;
  }
}
