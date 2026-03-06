import type { SceneryInstance, SceneryType } from "../types";
import { Terrain } from "../types";
import { randomId } from "../math/random";
import { TileMap } from "../world/TileMap";

export class SceneryManager {
  items: SceneryInstance[] = [];

  canPlace(col: number, row: number, tileMap: TileMap): boolean {
    return tileMap.isBuildable(col, row);
  }

  place(col: number, row: number, sceneryType: SceneryType, tileMap: TileMap): SceneryInstance | null {
    if (!this.canPlace(col, row, tileMap)) return null;

    const item: SceneryInstance = {
      id: randomId(),
      type: sceneryType,
      col,
      row,
    };

    const tile = tileMap.getTile(col, row);
    if (tile) {
      tile.sceneryId = item.id;
    }

    this.items.push(item);
    return item;
  }

  remove(sceneryId: string, tileMap: TileMap): SceneryInstance | null {
    const idx = this.items.findIndex((s) => s.id === sceneryId);
    if (idx === -1) return null;

    const item = this.items[idx];
    const tile = tileMap.getTile(item.col, item.row);
    if (tile) {
      tile.sceneryId = null;
      tile.terrain = Terrain.GRASS;
    }

    this.items.splice(idx, 1);
    return item;
  }

  getAt(col: number, row: number): SceneryInstance | undefined {
    return this.items.find((s) => s.col === col && s.row === row);
  }

  countNearby(col: number, row: number, radius: number): number {
    return this.items.filter(
      (s) => Math.abs(s.col - col) <= radius && Math.abs(s.row - row) <= radius,
    ).length;
  }
}
