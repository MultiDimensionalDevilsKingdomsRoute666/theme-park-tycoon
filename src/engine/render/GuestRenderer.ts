import { HALF_TILE_H } from "../constants";
import { tileToScreen } from "../math/isometric";
import type { Guest } from "../types";
import { Camera } from "../core/Camera";

export class GuestRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    guests: Guest[],
    camera: Camera,
    time: number,
  ): void {
    for (const guest of guests) {
      const interpCol = guest.prevCol + (guest.col - guest.prevCol) * guest.moveProgress;
      const interpRow = guest.prevRow + (guest.row - guest.prevRow) * guest.moveProgress;

      const pos = tileToScreen(interpCol, interpRow);
      const sx = (pos.x - camera.x) * camera.zoom;
      const sy = (pos.y + HALF_TILE_H - camera.y) * camera.zoom;

      if (sx < -20 || sx > camera.width + 20 || sy < -20 || sy > camera.height + 20) {
        continue;
      }

      this.drawGuest(ctx, sx, sy, guest, camera.zoom, time);
    }
  }

  private drawGuest(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    guest: Guest,
    zoom: number,
    time: number,
  ): void {
    const s = zoom;
    const wobble = guest.moveProgress < 1 ? Math.sin(time * 0.01 + parseInt(guest.id, 36)) * 2 * s : 0;

    ctx.fillStyle = guest.color;
    ctx.beginPath();
    ctx.arc(x + wobble, y - 6 * s, 3 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fdd8b5";
    ctx.beginPath();
    ctx.arc(x + wobble, y - 10 * s, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = guest.color;
    ctx.fillRect(x - 1 * s + wobble, y - 8 * s, 2 * s, 5 * s);

    ctx.fillStyle = "#333";
    ctx.fillRect(x - 1.5 * s + wobble, y - 3 * s, 1.5 * s, 3 * s);
    ctx.fillRect(x + wobble, y - 3 * s, 1.5 * s, 3 * s);
  }
}
