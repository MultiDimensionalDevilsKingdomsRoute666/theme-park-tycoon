import type { Guest } from "../types";
import { GAME_CONFIG } from "@/data/config";
import { SceneryManager } from "../entities/SceneryManager";
import { SCENERY_DEFINITIONS } from "@/data/scenery";
import { TileMap } from "../world/TileMap";

export class HappinessSystem {
  calculate(
    guests: Guest[],
    sceneryManager: SceneryManager,
    tileMap: TileMap,
  ): number {
    if (guests.length === 0) return 50;

    let totalHappiness = 0;
    for (const guest of guests) {
      let bonus = 0;
      for (const item of sceneryManager.items) {
        const dist = Math.abs(item.col - guest.col) + Math.abs(item.row - guest.row);
        if (dist <= GAME_CONFIG.sceneryRadius) {
          bonus += SCENERY_DEFINITIONS[item.type].happinessBonus * 0.5;
        }
      }

      const tile = tileMap.getTile(guest.col, guest.row);
      if (tile && tile.dirtLevel > 0.5) {
        guest.happiness = Math.max(0, guest.happiness - 0.05);
      }

      guest.happiness = Math.min(100, guest.happiness + bonus * 0.001);
      guest.happiness = Math.max(0, guest.happiness - GAME_CONFIG.happinessDecayRate);
      totalHappiness += guest.happiness;
    }

    return totalHappiness / guests.length;
  }
}
