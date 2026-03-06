import { HALF_TILE_W, HALF_TILE_H, MAP_SIZE, ENTRANCE_COL, ENTRANCE_ROW } from "../constants";
import { tileToScreen } from "../math/isometric";
import { ToolMode, Terrain } from "../types";
import type { TileCoord, RideDefinition } from "../types";
import { Camera } from "../core/Camera";
import { TileMap } from "../world/TileMap";

export class OverlayRenderer {
  renderHover(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    hoveredTile: TileCoord | null,
    toolMode: ToolMode,
    tileMap: TileMap,
    rideDef: RideDefinition | null,
  ): void {
    if (!hoveredTile) return;

    if (toolMode === ToolMode.RIDE && rideDef) {
      this.renderRideGhost(ctx, camera, hoveredTile, rideDef, tileMap);
    } else {
      this.renderTileHighlight(ctx, camera, hoveredTile, toolMode, tileMap);
    }
  }

  renderEntrance(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const pos = tileToScreen(ENTRANCE_COL, ENTRANCE_ROW);
    const sx = (pos.x - camera.x) * camera.zoom;
    const sy = (pos.y - camera.y) * camera.zoom;
    const s = camera.zoom;

    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.moveTo(sx, sy - 10 * s);
    ctx.lineTo(sx + 15 * s, sy + HALF_TILE_H * s - 5 * s);
    ctx.lineTo(sx - 15 * s, sy + HALF_TILE_H * s - 5 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.font = `bold ${8 * s}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("IN", sx, sy + HALF_TILE_H * s - 8 * s);
  }

  renderMinimap(
    ctx: CanvasRenderingContext2D,
    tileMap: TileMap,
    camera: Camera,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const mmSize = 120;
    const mmX = canvasWidth - mmSize - 10;
    const mmY = canvasHeight - mmSize - 10;
    const tileSize = mmSize / MAP_SIZE;

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(mmX - 2, mmY - 2, mmSize + 4, mmSize + 4);

    for (let col = 0; col < MAP_SIZE; col++) {
      for (let row = 0; row < MAP_SIZE; row++) {
        const tile = tileMap.getTile(col, row);
        if (!tile) continue;

        switch (tile.terrain) {
          case Terrain.GRASS:
            ctx.fillStyle = tile.rideId ? "#e74c3c" : tile.sceneryId ? "#27ae60" : "#4caf50";
            break;
          case Terrain.PATH:
            ctx.fillStyle = "#b0a090";
            break;
          case Terrain.WATER:
            ctx.fillStyle = "#2196f3";
            break;
          case Terrain.DIRT:
            ctx.fillStyle = "#8d6e63";
            break;
        }
        ctx.fillRect(mmX + col * tileSize, mmY + row * tileSize, tileSize, tileSize);
      }
    }

    const viewLeft = camera.x / (MAP_SIZE * HALF_TILE_W * 2) * mmSize;
    const viewTop = camera.y / (MAP_SIZE * HALF_TILE_H * 2) * mmSize;
    const viewWidth = (camera.width / camera.zoom) / (MAP_SIZE * HALF_TILE_W * 2) * mmSize;
    const viewHeight = (camera.height / camera.zoom) / (MAP_SIZE * HALF_TILE_H * 2) * mmSize;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(mmX + viewLeft, mmY + viewTop, viewWidth, viewHeight);
  }

  private renderTileHighlight(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    tile: TileCoord,
    toolMode: ToolMode,
    tileMap: TileMap,
  ): void {
    const pos = tileToScreen(tile.col, tile.row);
    const sx = (pos.x - camera.x) * camera.zoom;
    const sy = (pos.y - camera.y) * camera.zoom;
    const hw = HALF_TILE_W * camera.zoom;
    const hh = HALF_TILE_H * camera.zoom;

    let valid = true;
    if (toolMode === ToolMode.PATH) {
      valid = tileMap.isBuildable(tile.col, tile.row);
    } else if (toolMode === ToolMode.SCENERY) {
      valid = tileMap.isBuildable(tile.col, tile.row);
    } else if (toolMode === ToolMode.DEMOLISH) {
      const t = tileMap.getTile(tile.col, tile.row);
      valid = t !== null && (t.terrain === Terrain.PATH || t.rideId !== null || t.sceneryId !== null);
    }

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + hw, sy + hh);
    ctx.lineTo(sx, sy + hh * 2);
    ctx.lineTo(sx - hw, sy + hh);
    ctx.closePath();

    ctx.fillStyle = valid ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)";
    ctx.fill();
    ctx.strokeStyle = valid ? "#4caf50" : "#f44336";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private renderRideGhost(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    tile: TileCoord,
    rideDef: RideDefinition,
    tileMap: TileMap,
  ): void {
    let allValid = true;
    let hasAdjacentPath = false;

    for (let dc = 0; dc < rideDef.footprint.width; dc++) {
      for (let dr = 0; dr < rideDef.footprint.height; dr++) {
        const c = tile.col + dc;
        const r = tile.row + dr;
        if (!tileMap.isBuildable(c, r)) {
          allValid = false;
        }
        if (tileMap.hasAdjacentPath(c, r)) {
          hasAdjacentPath = true;
        }
      }
    }

    const valid = allValid && hasAdjacentPath;

    for (let dc = 0; dc < rideDef.footprint.width; dc++) {
      for (let dr = 0; dr < rideDef.footprint.height; dr++) {
        const pos = tileToScreen(tile.col + dc, tile.row + dr);
        const sx = (pos.x - camera.x) * camera.zoom;
        const sy = (pos.y - camera.y) * camera.zoom;
        const hw = HALF_TILE_W * camera.zoom;
        const hh = HALF_TILE_H * camera.zoom;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + hw, sy + hh);
        ctx.lineTo(sx, sy + hh * 2);
        ctx.lineTo(sx - hw, sy + hh);
        ctx.closePath();

        ctx.fillStyle = valid ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)";
        ctx.fill();
        ctx.strokeStyle = valid ? "#4caf50" : "#f44336";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }
}
