import { ToolMode, Terrain } from "../types";
import type { RideType, SceneryType, Toast } from "../types";
import { PATH_COST, DEMOLISH_REFUND_RATE } from "../constants";
import { RIDE_DEFINITIONS } from "@/data/rides";
import { SCENERY_DEFINITIONS } from "@/data/scenery";
import { TileMap } from "../world/TileMap";
import { RideManager } from "../entities/RideManager";
import { SceneryManager } from "../entities/SceneryManager";
import { randomId } from "../math/random";

export class PlacementManager {
  private tileMap: TileMap;
  private rideManager: RideManager;
  private sceneryManager: SceneryManager;

  constructor(
    tileMap: TileMap,
    rideManager: RideManager,
    sceneryManager: SceneryManager,
  ) {
    this.tileMap = tileMap;
    this.rideManager = rideManager;
    this.sceneryManager = sceneryManager;
  }

  handleClick(
    col: number,
    row: number,
    toolMode: ToolMode,
    selectedRideType: RideType | null,
    selectedSceneryType: SceneryType | null,
    money: number,
    addMoney: (amount: number) => void,
    addToast: (toast: Toast) => void,
    setSelectedEntityId: (id: string | null) => void,
  ): void {
    switch (toolMode) {
      case ToolMode.SELECT:
        this.handleSelect(col, row, setSelectedEntityId);
        break;
      case ToolMode.PATH:
        this.handlePath(col, row, money, addMoney, addToast);
        break;
      case ToolMode.RIDE:
        if (selectedRideType) {
          this.handleRide(col, row, selectedRideType, money, addMoney, addToast);
        }
        break;
      case ToolMode.SCENERY:
        if (selectedSceneryType) {
          this.handleScenery(col, row, selectedSceneryType, money, addMoney, addToast);
        }
        break;
      case ToolMode.DEMOLISH:
        this.handleDemolish(col, row, addMoney, addToast);
        break;
    }
  }

  handleDrag(
    col: number,
    row: number,
    toolMode: ToolMode,
    money: number,
    addMoney: (amount: number) => void,
    addToast: (toast: Toast) => void,
  ): void {
    if (toolMode === ToolMode.PATH) {
      this.handlePath(col, row, money, addMoney, addToast);
    } else if (toolMode === ToolMode.DEMOLISH) {
      this.handleDemolish(col, row, addMoney, addToast);
    }
  }

  private handleSelect(col: number, row: number, setSelectedEntityId: (id: string | null) => void): void {
    const tile = this.tileMap.getTile(col, row);
    if (!tile) return;

    if (tile.rideId) {
      setSelectedEntityId(tile.rideId);
    } else if (tile.sceneryId) {
      setSelectedEntityId(tile.sceneryId);
    } else {
      setSelectedEntityId(null);
    }
  }

  private handlePath(
    col: number,
    row: number,
    money: number,
    addMoney: (amount: number) => void,
    addToast: (toast: Toast) => void,
  ): void {
    if (money < PATH_COST) {
      addToast({
        id: randomId(),
        message: "Not enough money for path!",
        type: "error",
        timer: 2000,
      });
      return;
    }

    if (!this.tileMap.isBuildable(col, row)) return;

    this.tileMap.setTerrain(col, row, Terrain.PATH);
    addMoney(-PATH_COST);
  }

  private handleRide(
    col: number,
    row: number,
    rideType: RideType,
    money: number,
    addMoney: (amount: number) => void,
    addToast: (toast: Toast) => void,
  ): void {
    const def = RIDE_DEFINITIONS[rideType];
    if (money < def.cost) {
      addToast({
        id: randomId(),
        message: `Not enough money for ${def.name}!`,
        type: "error",
        timer: 2000,
      });
      return;
    }

    const ride = this.rideManager.place(col, row, rideType, this.tileMap);
    if (ride) {
      addMoney(-def.cost);
      addToast({
        id: randomId(),
        message: `Built ${def.name}!`,
        type: "success",
        timer: 2000,
      });
    }
  }

  private handleScenery(
    col: number,
    row: number,
    sceneryType: SceneryType,
    money: number,
    addMoney: (amount: number) => void,
    addToast: (toast: Toast) => void,
  ): void {
    const def = SCENERY_DEFINITIONS[sceneryType];
    if (money < def.cost) {
      addToast({
        id: randomId(),
        message: `Not enough money for ${def.name}!`,
        type: "error",
        timer: 2000,
      });
      return;
    }

    const item = this.sceneryManager.place(col, row, sceneryType, this.tileMap);
    if (item) {
      addMoney(-def.cost);
    }
  }

  private handleDemolish(
    col: number,
    row: number,
    addMoney: (amount: number) => void,
    addToast: (toast: Toast) => void,
  ): void {
    const tile = this.tileMap.getTile(col, row);
    if (!tile) return;

    if (tile.rideId) {
      const ride = this.rideManager.remove(tile.rideId, this.tileMap);
      if (ride) {
        const def = RIDE_DEFINITIONS[ride.type];
        const refund = Math.floor(def.cost * DEMOLISH_REFUND_RATE);
        addMoney(refund);
        addToast({
          id: randomId(),
          message: `Demolished ${def.name} (+$${refund})`,
          type: "warning",
          timer: 2000,
        });
      }
    } else if (tile.sceneryId) {
      const item = this.sceneryManager.remove(tile.sceneryId, this.tileMap);
      if (item) {
        const def = SCENERY_DEFINITIONS[item.type];
        const refund = Math.floor(def.cost * DEMOLISH_REFUND_RATE);
        addMoney(refund);
      }
    } else if (tile.terrain === Terrain.PATH) {
      tile.terrain = Terrain.GRASS;
      const refund = Math.floor(PATH_COST * DEMOLISH_REFUND_RATE);
      addMoney(refund);
    }
  }
}
