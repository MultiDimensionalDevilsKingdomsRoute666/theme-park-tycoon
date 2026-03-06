import { HALF_TILE_W, HALF_TILE_H } from "../constants";
import { tileToScreen } from "../math/isometric";
import { SceneryType } from "../types";
import type { SceneryInstance } from "../types";
import { SCENERY_DEFINITIONS } from "@/data/scenery";
import { Camera } from "../core/Camera";

export class SceneryRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    sceneryItems: SceneryInstance[],
    camera: Camera,
  ): void {
    for (const item of sceneryItems) {
      const pos = tileToScreen(item.col, item.row);
      const sx = (pos.x - camera.x) * camera.zoom;
      const sy = (pos.y - camera.y) * camera.zoom;

      if (sx < -100 || sx > camera.width + 100 || sy < -100 || sy > camera.height + 100) {
        continue;
      }

      this.drawScenery(ctx, sx, sy + HALF_TILE_H * camera.zoom, item, camera.zoom);
    }
  }

  private drawScenery(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    item: SceneryInstance,
    zoom: number,
  ): void {
    const s = zoom;
    const def = SCENERY_DEFINITIONS[item.type];

    ctx.save();
    ctx.translate(x, y);

    switch (item.type) {
      case SceneryType.OAK_TREE:
        this.drawOakTree(ctx, s, def.color);
        break;
      case SceneryType.PINE_TREE:
        this.drawPineTree(ctx, s, def.color);
        break;
      case SceneryType.PALM_TREE:
        this.drawPalmTree(ctx, s, def.color);
        break;
      case SceneryType.BENCH:
        this.drawBench(ctx, s);
        break;
      case SceneryType.FOUNTAIN:
        this.drawFountain(ctx, s, def.color);
        break;
      case SceneryType.LAMP_POST:
        this.drawLampPost(ctx, s, def.color);
        break;
      case SceneryType.FLOWER_BED:
        this.drawFlowerBed(ctx, s, def.color);
        break;
      case SceneryType.FOOD_STALL:
        this.drawFoodStall(ctx, s, def.color);
        break;
    }

    ctx.restore();
  }

  private drawOakTree(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(-2 * s, -5 * s, 4 * s, 10 * s);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -15 * s, 12 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.arc(-5 * s, -12 * s, 8 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPineTree(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(-2 * s, -3 * s, 4 * s, 8 * s);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -25 * s);
    ctx.lineTo(10 * s, -5 * s);
    ctx.lineTo(-10 * s, -5 * s);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -20 * s);
    ctx.lineTo(8 * s, -8 * s);
    ctx.lineTo(-8 * s, -8 * s);
    ctx.closePath();
    ctx.fill();
  }

  private drawPalmTree(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(0, 5 * s);
    ctx.quadraticCurveTo(3 * s, -10 * s, 0, -20 * s);
    ctx.stroke();

    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      ctx.save();
      ctx.translate(0, -20 * s);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(8 * s, 0, 10 * s, 3 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawBench(ctx: CanvasRenderingContext2D, s: number): void {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(-8 * s, -2 * s, 16 * s, 3 * s);
    ctx.fillRect(-7 * s, -5 * s, 14 * s, 3 * s);
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(-7 * s, 1 * s, 2 * s, 4 * s);
    ctx.fillRect(5 * s, 1 * s, 2 * s, 4 * s);
  }

  private drawFountain(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.fillStyle = "#9e9e9e";
    ctx.beginPath();
    ctx.ellipse(0, 2 * s, 12 * s, 6 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(0, 2 * s, 10 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#9e9e9e";
    ctx.fillRect(-2 * s, -8 * s, 4 * s, 12 * s);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -10 * s);
    ctx.quadraticCurveTo(6 * s, -15 * s, 4 * s, -5 * s);
    ctx.quadraticCurveTo(-6 * s, -15 * s, 0, -10 * s);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private drawLampPost(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.fillStyle = "#333";
    ctx.fillRect(-1.5 * s, -20 * s, 3 * s, 25 * s);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -22 * s, 4 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff3e0";
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(0, -22 * s, 8 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private drawFlowerBed(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.fillStyle = "#4e342e";
    ctx.beginPath();
    ctx.ellipse(0, 2 * s, 10 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    const colors = [color, "#ff4081", "#ffeb3b", "#e040fb", "#ff5722"];
    for (let i = 0; i < 7; i++) {
      const fx = (Math.random() - 0.5) * 14 * s;
      const fy = (Math.random() - 0.5) * 6 * s;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(fx, fy, 2 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawFoodStall(ctx: CanvasRenderingContext2D, s: number, color: string): void {
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(-10 * s, -5 * s, 20 * s, 12 * s);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-12 * s, -5 * s);
    ctx.lineTo(0, -18 * s);
    ctx.lineTo(12 * s, -5 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(-6 * s, -2 * s, 12 * s, 6 * s);
    ctx.fillStyle = "#333";
    ctx.font = `${6 * s}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("FOOD", 0, 3 * s);
  }
}
