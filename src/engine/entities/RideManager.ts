import type { RideInstance, RideType } from "../types";
import { RIDE_DEFINITIONS } from "@/data/rides";
import { randomId } from "../math/random";
import { TileMap } from "../world/TileMap";
import { Terrain } from "../types";

export class RideManager {
  rides: RideInstance[] = [];

  canPlace(col: number, row: number, rideType: RideType, tileMap: TileMap): boolean {
    const def = RIDE_DEFINITIONS[rideType];
    let hasAdjacentPath = false;

    for (let dc = 0; dc < def.footprint.width; dc++) {
      for (let dr = 0; dr < def.footprint.height; dr++) {
        if (!tileMap.isBuildable(col + dc, row + dr)) return false;
        if (tileMap.hasAdjacentPath(col + dc, row + dr)) hasAdjacentPath = true;
      }
    }

    return hasAdjacentPath;
  }

  place(col: number, row: number, rideType: RideType, tileMap: TileMap): RideInstance | null {
    if (!this.canPlace(col, row, rideType, tileMap)) return null;

    const def = RIDE_DEFINITIONS[rideType];
    const ride: RideInstance = {
      id: randomId(),
      type: rideType,
      col,
      row,
      queue: [],
      riders: [],
      cycleTimer: 0,
      isRunning: false,
      totalRides: 0,
      totalRevenue: 0,
    };

    for (let dc = 0; dc < def.footprint.width; dc++) {
      for (let dr = 0; dr < def.footprint.height; dr++) {
        const tile = tileMap.getTile(col + dc, row + dr);
        if (tile) {
          tile.rideId = ride.id;
          tile.terrain = Terrain.DIRT;
        }
      }
    }

    this.rides.push(ride);
    return ride;
  }

  remove(rideId: string, tileMap: TileMap): RideInstance | null {
    const idx = this.rides.findIndex((r) => r.id === rideId);
    if (idx === -1) return null;

    const ride = this.rides[idx];
    const def = RIDE_DEFINITIONS[ride.type];

    for (let dc = 0; dc < def.footprint.width; dc++) {
      for (let dr = 0; dr < def.footprint.height; dr++) {
        const tile = tileMap.getTile(ride.col + dc, ride.row + dr);
        if (tile) {
          tile.rideId = null;
          tile.terrain = Terrain.GRASS;
        }
      }
    }

    this.rides.splice(idx, 1);
    return ride;
  }

  getRide(id: string): RideInstance | undefined {
    return this.rides.find((r) => r.id === id);
  }

  getRideAt(col: number, row: number): RideInstance | undefined {
    return this.rides.find((r) => {
      const def = RIDE_DEFINITIONS[r.type];
      return (
        col >= r.col &&
        col < r.col + def.footprint.width &&
        row >= r.row &&
        row < r.row + def.footprint.height
      );
    });
  }

  update(dt: number, onCycleComplete: (ride: RideInstance) => void): void {
    for (const ride of this.rides) {
      if (ride.isRunning) {
        ride.cycleTimer += dt;
        const def = RIDE_DEFINITIONS[ride.type];
        if (ride.cycleTimer >= def.cycleDuration) {
          ride.cycleTimer = 0;
          ride.isRunning = false;
          ride.totalRides++;
          onCycleComplete(ride);
        }
      } else if (ride.queue.length > 0) {
        const def = RIDE_DEFINITIONS[ride.type];
        const boardCount = Math.min(ride.queue.length, def.capacity);
        ride.riders = ride.queue.splice(0, boardCount);
        ride.isRunning = true;
        ride.cycleTimer = 0;
      }
    }
  }
}
