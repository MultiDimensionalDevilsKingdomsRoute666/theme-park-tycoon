import { HALF_TILE_W, HALF_TILE_H } from "../constants";
import type { Position, TileCoord } from "../types";

export function tileToScreen(col: number, row: number): Position {
  return {
    x: (col - row) * HALF_TILE_W,
    y: (col + row) * HALF_TILE_H,
  };
}

export function screenToTile(screenX: number, screenY: number): TileCoord {
  const col = Math.floor(screenX / HALF_TILE_W + screenY / HALF_TILE_H) / 2;
  const row = Math.floor(screenY / HALF_TILE_H - screenX / HALF_TILE_W) / 2;
  return {
    col: Math.floor(col),
    row: Math.floor(row),
  };
}

export function tileToScreenCenter(col: number, row: number): Position {
  const pos = tileToScreen(col, row);
  return {
    x: pos.x,
    y: pos.y + HALF_TILE_H,
  };
}
