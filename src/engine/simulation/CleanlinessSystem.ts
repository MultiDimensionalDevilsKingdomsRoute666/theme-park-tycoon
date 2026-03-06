import { MAP_SIZE } from "../constants";
import { GAME_CONFIG } from "@/data/config";
import { Terrain } from "../types";
import { TileMap } from "../world/TileMap";
import type { Guest } from "../types";

export class CleanlinessSystem {
  update(dt: number, tileMap: TileMap, guests: Guest[]): void {
    for (const guest of guests) {
      const tile = tileMap.getTile(guest.col, guest.row);
      if (tile && tile.terrain === Terrain.PATH) {
        tile.dirtLevel = Math.min(
          GAME_CONFIG.maxDirtLevel,
          tile.dirtLevel + GAME_CONFIG.dirtAccumulationRate * dt * 0.001,
        );
      }
    }
  }

  calculate(tileMap: TileMap): number {
    let totalDirt = 0;
    let pathTiles = 0;

    for (let col = 0; col < MAP_SIZE; col++) {
      for (let row = 0; row < MAP_SIZE; row++) {
        const tile = tileMap.getTile(col, row);
        if (tile && tile.terrain === Terrain.PATH) {
          pathTiles++;
          totalDirt += tile.dirtLevel;
        }
      }
    }

    if (pathTiles === 0) return 100;
    return Math.max(0, 100 - (totalDirt / pathTiles) * 100);
  }
}
