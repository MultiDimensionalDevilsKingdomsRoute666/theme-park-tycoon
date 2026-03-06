import {
  ENTRANCE_COL,
  ENTRANCE_ROW,
  MAX_GUESTS,
  GUEST_COLORS,
  GUEST_MOVE_SPEED,
} from "../constants";
import { GAME_CONFIG } from "@/data/config";
import { GuestState } from "../types";
import type { Guest } from "../types";
import { randomId, randomChoice } from "../math/random";
import { findPath } from "../math/astar";
import { TileMap } from "../world/TileMap";
import { RideManager } from "./RideManager";
import { RIDE_DEFINITIONS } from "@/data/rides";

export class GuestManager {
  guests: Guest[] = [];
  private spawnTimer = 0;
  private spawnInterval = GAME_CONFIG.guestSpawnBaseInterval;

  setSpawnRate(parkRating: number): void {
    const factor = 1 - parkRating * GAME_CONFIG.ratingToSpawnMultiplier;
    this.spawnInterval = Math.max(
      GAME_CONFIG.guestSpawnMinInterval,
      GAME_CONFIG.guestSpawnBaseInterval * Math.max(0.2, factor),
    );
  }

  update(
    dt: number,
    tileMap: TileMap,
    rideManager: RideManager,
    addMoney: (amount: number) => void,
  ): void {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval && this.guests.length < MAX_GUESTS) {
      if (tileMap.isPath(ENTRANCE_COL, ENTRANCE_ROW)) {
        this.spawn();
        this.spawnTimer = 0;
      }
    }

    for (const guest of this.guests) {
      this.updateGuest(guest, dt, tileMap, rideManager, addMoney);
    }

    this.guests = this.guests.filter((g) => g.state !== GuestState.LEAVING || g.moveProgress < 1);
  }

  private spawn(): void {
    const guest: Guest = {
      id: randomId(),
      col: ENTRANCE_COL,
      row: ENTRANCE_ROW,
      prevCol: ENTRANCE_COL,
      prevRow: ENTRANCE_ROW,
      moveProgress: 1,
      state: GuestState.ENTERING,
      happiness: 70 + Math.random() * 30,
      money: GAME_CONFIG.guestStartMoney,
      color: randomChoice(GUEST_COLORS),
      targetRideId: null,
      path: [],
      pathIndex: 0,
      waitTime: 0,
      ridesRidden: 0,
    };
    this.guests.push(guest);
  }

  private updateGuest(
    guest: Guest,
    dt: number,
    tileMap: TileMap,
    rideManager: RideManager,
    addMoney: (amount: number) => void,
  ): void {
    if (guest.moveProgress < 1) {
      guest.moveProgress = Math.min(1, guest.moveProgress + GUEST_MOVE_SPEED * dt);
      if (guest.moveProgress >= 1) {
        guest.prevCol = guest.col;
        guest.prevRow = guest.row;
      }
      return;
    }

    switch (guest.state) {
      case GuestState.ENTERING:
        this.handleEntering(guest, tileMap, rideManager);
        break;
      case GuestState.WANDERING:
        this.handleWandering(guest, tileMap, rideManager);
        break;
      case GuestState.WALKING_TO_RIDE:
        this.handleWalkingToRide(guest, tileMap, rideManager, addMoney);
        break;
      case GuestState.QUEUING:
        this.handleQueuing(guest, dt, rideManager);
        break;
      case GuestState.RIDING:
        break;
      case GuestState.LEAVING:
        this.handleLeaving(guest);
        break;
    }
  }

  private handleEntering(guest: Guest, tileMap: TileMap, rideManager: RideManager): void {
    if (rideManager.rides.length > 0 && Math.random() < 0.7) {
      this.pickRide(guest, tileMap, rideManager);
    } else {
      guest.state = GuestState.WANDERING;
      this.pickRandomWalk(guest, tileMap);
    }
  }

  private handleWandering(guest: Guest, tileMap: TileMap, rideManager: RideManager): void {
    if (guest.path.length > 0 && guest.pathIndex < guest.path.length) {
      this.moveAlongPath(guest);
    } else {
      guest.waitTime += 16;
      if (guest.waitTime > 2000) {
        guest.waitTime = 0;
        if (rideManager.rides.length > 0 && Math.random() < 0.6) {
          this.pickRide(guest, tileMap, rideManager);
        } else if (guest.ridesRidden >= 2 && Math.random() < 0.3) {
          guest.state = GuestState.LEAVING;
          this.pathToEntrance(guest, tileMap);
        } else {
          this.pickRandomWalk(guest, tileMap);
        }
      }
    }
  }

  private handleWalkingToRide(
    guest: Guest,
    tileMap: TileMap,
    rideManager: RideManager,
    addMoney: (amount: number) => void,
  ): void {
    if (guest.path.length > 0 && guest.pathIndex < guest.path.length) {
      this.moveAlongPath(guest);
    } else {
      const ride = guest.targetRideId ? rideManager.getRide(guest.targetRideId) : undefined;
      if (ride) {
        const def = RIDE_DEFINITIONS[ride.type];
        if (guest.money >= def.ticketPrice) {
          guest.money -= def.ticketPrice;
          ride.totalRevenue += def.ticketPrice;
          addMoney(def.ticketPrice);
          ride.queue.push(guest.id);
          guest.state = GuestState.QUEUING;
        } else {
          guest.state = GuestState.WANDERING;
          guest.targetRideId = null;
        }
      } else {
        guest.state = GuestState.WANDERING;
        guest.targetRideId = null;
      }
    }
  }

  private handleQueuing(guest: Guest, dt: number, rideManager: RideManager): void {
    guest.waitTime += dt;
    if (guest.waitTime > GAME_CONFIG.queuePatience) {
      const ride = guest.targetRideId ? rideManager.getRide(guest.targetRideId) : undefined;
      if (ride) {
        ride.queue = ride.queue.filter((id) => id !== guest.id);
      }
      guest.happiness -= 15;
      guest.state = GuestState.WANDERING;
      guest.targetRideId = null;
      guest.waitTime = 0;
    }
  }

  private handleLeaving(guest: Guest): void {
    if (guest.path.length > 0 && guest.pathIndex < guest.path.length) {
      this.moveAlongPath(guest);
    }
  }

  onRideCycleComplete(ride: { riders: string[] }, rideExcitement: number): void {
    for (const riderId of ride.riders) {
      const guest = this.guests.find((g) => g.id === riderId);
      if (guest) {
        guest.state = GuestState.WANDERING;
        guest.happiness = Math.min(100, guest.happiness + rideExcitement * 0.3);
        guest.ridesRidden++;
        guest.targetRideId = null;
        guest.waitTime = 0;
      }
    }
    ride.riders = [];
  }

  private pickRide(guest: Guest, tileMap: TileMap, rideManager: RideManager): void {
    const availableRides = rideManager.rides.filter((r) => {
      const def = RIDE_DEFINITIONS[r.type];
      return guest.money >= def.ticketPrice;
    });
    if (availableRides.length === 0) {
      guest.state = GuestState.WANDERING;
      return;
    }

    const ride = randomChoice(availableRides);
    guest.targetRideId = ride.id;

    const pathTile = tileMap.getPathNeighbors(ride.col, ride.row)[0] ||
      tileMap.getPathNeighbors(ride.col + 1, ride.row)[0];

    if (pathTile) {
      const path = findPath(
        { col: guest.col, row: guest.row },
        pathTile,
        (c, r) => tileMap.isWalkable(c, r),
      );
      if (path && path.length > 1) {
        guest.path = path;
        guest.pathIndex = 1;
        guest.state = GuestState.WALKING_TO_RIDE;
        return;
      }
    }

    guest.state = GuestState.WANDERING;
    guest.targetRideId = null;
  }

  private pickRandomWalk(guest: Guest, tileMap: TileMap): void {
    const neighbors = tileMap.getPathNeighbors(guest.col, guest.row);
    if (neighbors.length > 0) {
      const target = randomChoice(neighbors);
      guest.path = [{ col: guest.col, row: guest.row }, target];
      guest.pathIndex = 1;
    }
  }

  private pathToEntrance(guest: Guest, tileMap: TileMap): void {
    const path = findPath(
      { col: guest.col, row: guest.row },
      { col: ENTRANCE_COL, row: ENTRANCE_ROW },
      (c, r) => tileMap.isWalkable(c, r),
    );
    if (path && path.length > 1) {
      guest.path = path;
      guest.pathIndex = 1;
    }
  }

  private moveAlongPath(guest: Guest): void {
    if (guest.pathIndex >= guest.path.length) return;
    const next = guest.path[guest.pathIndex];
    guest.prevCol = guest.col;
    guest.prevRow = guest.row;
    guest.col = next.col;
    guest.row = next.row;
    guest.moveProgress = 0;
    guest.pathIndex++;
  }
}
