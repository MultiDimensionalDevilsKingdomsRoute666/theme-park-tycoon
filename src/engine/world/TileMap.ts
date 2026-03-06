import { MAP_SIZE } from "../constants";
import { Terrain } from "../types";
import type { Tile } from "../types";

export class TileMap {
  tiles: Tile[][] = [];

  constructor() {
    this.generate();
  }

  private generate(): void {
    this.tiles = [];
    for (let col = 0; col < MAP_SIZE; col++) {
      this.tiles[col] = [];
      for (let row = 0; row < MAP_SIZE; row++) {
        let terrain = Terrain.GRASS;
        const distFromCenter = Math.sqrt(
          Math.pow(col - MAP_SIZE / 2, 2) + Math.pow(row - MAP_SIZE / 2, 2),
        );
        if (distFromCenter > MAP_SIZE / 2 - 2) {
          terrain = Terrain.WATER;
        }
        this.tiles[col][row] = {
          col,
          row,
          terrain,
          rideId: null,
          sceneryId: null,
          dirtLevel: 0,
        };
      }
    }
  }

  getTile(col: number, row: number): Tile | null {
    if (col < 0 || col >= MAP_SIZE || row < 0 || row >= MAP_SIZE) return null;
    return this.tiles[col][row];
  }

  setTerrain(col: number, row: number, terrain: Terrain): void {
    const tile = this.getTile(col, row);
    if (tile) tile.terrain = terrain;
  }

  isInBounds(col: number, row: number): boolean {
    return col >= 0 && col < MAP_SIZE && row >= 0 && row < MAP_SIZE;
  }

  isBuildable(col: number, row: number): boolean {
    const tile = this.getTile(col, row);
    if (!tile) return false;
    return (
      tile.terrain === Terrain.GRASS &&
      tile.rideId === null &&
      tile.sceneryId === null
    );
  }

  isPath(col: number, row: number): boolean {
    const tile = this.getTile(col, row);
    return tile !== null && tile.terrain === Terrain.PATH;
  }

  isWalkable(col: number, row: number): boolean {
    const tile = this.getTile(col, row);
    return tile !== null && tile.terrain === Terrain.PATH;
  }

  hasAdjacentPath(col: number, row: number): boolean {
    return (
      this.isPath(col - 1, row) ||
      this.isPath(col + 1, row) ||
      this.isPath(col, row - 1) ||
      this.isPath(col, row + 1)
    );
  }

  getPathNeighbors(col: number, row: number): { col: number; row: number }[] {
    const neighbors: { col: number; row: number }[] = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dc, dr] of dirs) {
      if (this.isPath(col + dc, row + dr)) {
        neighbors.push({ col: col + dc, row: row + dr });
      }
    }
    return neighbors;
  }
}
