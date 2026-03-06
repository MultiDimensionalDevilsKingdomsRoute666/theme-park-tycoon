import { MAP_SIZE } from "../constants";
import { screenToTile } from "../math/isometric";
import { Camera } from "./Camera";
import type { TileCoord } from "../types";

export class TilePicker {
  pick(screenX: number, screenY: number, camera: Camera): TileCoord | null {
    const world = camera.screenToWorld(screenX, screenY);
    const tile = screenToTile(world.x, world.y);
    if (tile.col >= 0 && tile.col < MAP_SIZE && tile.row >= 0 && tile.row < MAP_SIZE) {
      return tile;
    }
    return null;
  }
}
