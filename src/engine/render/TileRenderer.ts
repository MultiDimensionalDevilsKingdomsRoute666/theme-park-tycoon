import { HALF_TILE_W, HALF_TILE_H, MAP_SIZE } from "../constants";
import { tileToScreen } from "../math/isometric";
import { Terrain } from "../types";
import type { Tile } from "../types";
import { Camera } from "../core/Camera";

const TERRAIN_COLORS: Record<Terrain, string> = {
  [Terrain.GRASS]: "#4caf50",
  [Terrain.PATH]: "#b0a090",
  [Terrain.WATER]: "#2196f3",
  [Terrain.DIRT]: "#8d6e63",
};

const TERRAIN_HIGHLIGHT: Record<Terrain, string> = {
  [Terrain.GRASS]: "#66bb6a",
  [Terrain.PATH]: "#c4b8a8",
  [Terrain.WATER]: "#42a5f5",
  [Terrain.DIRT]: "#a1887f",
};

export class TileRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    tiles: Tile[][],
    camera: Camera,
  ): void {
    for (let col = 0; col < MAP_SIZE; col++) {
      for (let row = 0; row < MAP_SIZE; row++) {
        const tile = tiles[col][row];
        const screenPos = tileToScreen(col, row);
        const sx = (screenPos.x - camera.x) * camera.zoom;
        const sy = (screenPos.y - camera.y) * camera.zoom;

        if (
          sx < -HALF_TILE_W * camera.zoom * 2 ||
          sx > camera.width + HALF_TILE_W * camera.zoom * 2 ||
          sy < -HALF_TILE_H * camera.zoom * 2 ||
          sy > camera.height + HALF_TILE_H * camera.zoom * 2
        ) {
          continue;
        }

        this.drawTile(ctx, sx, sy, tile, camera.zoom);
      }
    }
  }

  private drawTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tile: Tile,
    zoom: number,
  ): void {
    const hw = HALF_TILE_W * zoom;
    const hh = HALF_TILE_H * zoom;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + hw, y + hh);
    ctx.lineTo(x, y + hh * 2);
    ctx.lineTo(x - hw, y + hh);
    ctx.closePath();

    ctx.fillStyle = TERRAIN_COLORS[tile.terrain];
    ctx.fill();

    ctx.strokeStyle = TERRAIN_HIGHLIGHT[tile.terrain];
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if (tile.terrain === Terrain.PATH) {
      this.drawPathDetail(ctx, x, y, hw, hh);
    }

    if (tile.dirtLevel > 0.3) {
      ctx.fillStyle = `rgba(101, 67, 33, ${tile.dirtLevel * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + hw, y + hh);
      ctx.lineTo(x, y + hh * 2);
      ctx.lineTo(x - hw, y + hh);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawPathDetail(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    hw: number,
    hh: number,
  ): void {
    ctx.strokeStyle = "#9e9585";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - hw * 0.3, y + hh * 0.7);
    ctx.lineTo(x + hw * 0.3, y + hh * 1.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + hw * 0.3, y + hh * 0.7);
    ctx.lineTo(x - hw * 0.3, y + hh * 1.3);
    ctx.stroke();
  }
}
