import { tileToScreen } from "../math/isometric";
import { RideType } from "../types";
import type { RideInstance } from "../types";
import { RIDE_DEFINITIONS } from "@/data/rides";
import { Camera } from "../core/Camera";

export class RideRenderer {
  render(
    ctx: CanvasRenderingContext2D,
    rides: RideInstance[],
    camera: Camera,
    time: number,
  ): void {
    for (const ride of rides) {
      const def = RIDE_DEFINITIONS[ride.type];
      const centerCol = ride.col + def.footprint.width / 2;
      const centerRow = ride.row + def.footprint.height / 2;
      const pos = tileToScreen(centerCol, centerRow);
      const sx = (pos.x - camera.x) * camera.zoom;
      const sy = (pos.y - camera.y) * camera.zoom;

      if (sx < -200 || sx > camera.width + 200 || sy < -200 || sy > camera.height + 200) {
        continue;
      }

      this.drawRide(ctx, sx, sy, ride, camera.zoom, time);
    }
  }

  private drawRide(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    ride: RideInstance,
    zoom: number,
    time: number,
  ): void {
    const def = RIDE_DEFINITIONS[ride.type];
    const scale = zoom;

    ctx.save();
    ctx.translate(x, y);

    switch (ride.type) {
      case RideType.ROLLER_COASTER:
        this.drawRollerCoaster(ctx, scale, def.color, time);
        break;
      case RideType.FERRIS_WHEEL:
        this.drawFerrisWheel(ctx, scale, def.color, time);
        break;
      case RideType.CAROUSEL:
        this.drawCarousel(ctx, scale, def.color, time);
        break;
      case RideType.BUMPER_CARS:
        this.drawBumperCars(ctx, scale, def.color);
        break;
      case RideType.DROP_TOWER:
        this.drawDropTower(ctx, scale, def.color, time, ride.isRunning);
        break;
      case RideType.LOG_FLUME:
        this.drawLogFlume(ctx, scale, def.color);
        break;
    }

    ctx.restore();
  }

  private drawRollerCoaster(
    ctx: CanvasRenderingContext2D,
    s: number,
    color: string,
    time: number,
  ): void {
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(-50 * s, 20 * s);
    ctx.quadraticCurveTo(-20 * s, -60 * s, 0, -40 * s);
    ctx.quadraticCurveTo(20 * s, -20 * s, 40 * s, -50 * s);
    ctx.quadraticCurveTo(55 * s, -70 * s, 50 * s, 20 * s);
    ctx.stroke();

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1 * s;
    for (let i = -40; i <= 40; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i * s, 20 * s);
      ctx.lineTo(i * s, -30 * s);
      ctx.stroke();
    }

    const carX = Math.sin(time * 0.002) * 35 * s;
    const carY = -40 * s + Math.cos(time * 0.002) * 20 * s;
    ctx.fillStyle = color;
    ctx.fillRect(carX - 8 * s, carY - 5 * s, 16 * s, 10 * s);
    ctx.fillStyle = "#333";
    ctx.fillRect(carX - 6 * s, carY - 8 * s, 4 * s, 3 * s);
    ctx.fillRect(carX + 2 * s, carY - 8 * s, 4 * s, 3 * s);
  }

  private drawFerrisWheel(
    ctx: CanvasRenderingContext2D,
    s: number,
    color: string,
    time: number,
  ): void {
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(-20 * s, 25 * s);
    ctx.lineTo(0, -5 * s);
    ctx.lineTo(20 * s, 25 * s);
    ctx.stroke();

    const radius = 35 * s;
    const centerY = -15 * s;

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.arc(0, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    const angle = time * 0.001;
    for (let i = 0; i < 8; i++) {
      const a = angle + (i * Math.PI * 2) / 8;
      const gx = Math.cos(a) * radius;
      const gy = centerY + Math.sin(a) * radius;

      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(gx, gy);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(gx, gy, 5 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.arc(0, centerY, 4 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawCarousel(
    ctx: CanvasRenderingContext2D,
    s: number,
    color: string,
    time: number,
  ): void {
    ctx.fillStyle = "#d4a574";
    ctx.beginPath();
    ctx.ellipse(0, 10 * s, 30 * s, 15 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b8956a";
    ctx.lineWidth = 1 * s;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-25 * s, -20 * s);
    ctx.lineTo(25 * s, -20 * s);
    ctx.lineTo(30 * s, -15 * s);
    ctx.lineTo(-30 * s, -15 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(-2 * s, -20 * s, 4 * s, -15 * s);

    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(0, -40 * s);
    ctx.lineTo(5 * s, -35 * s);
    ctx.lineTo(-5 * s, -35 * s);
    ctx.closePath();
    ctx.fill();

    const angle = time * 0.002;
    for (let i = 0; i < 6; i++) {
      const a = angle + (i * Math.PI * 2) / 6;
      const hx = Math.cos(a) * 20 * s;
      const hy = 5 * s + Math.sin(a) * 10 * s;
      ctx.fillStyle = i % 2 === 0 ? "#fff" : color;
      ctx.fillRect(hx - 3 * s, hy - 10 * s, 6 * s, 10 * s);
    }
  }

  private drawBumperCars(
    ctx: CanvasRenderingContext2D,
    s: number,
    color: string,
  ): void {
    ctx.fillStyle = "#666";
    ctx.beginPath();
    ctx.ellipse(0, 10 * s, 35 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#444";
    ctx.beginPath();
    ctx.ellipse(0, 8 * s, 33 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    const carPositions = [
      [-12, -2], [12, 5], [-5, 8], [15, -5], [-15, 3],
    ];
    const carColors = [color, "#3498db", "#f1c40f", "#e74c3c", "#9b59b6"];
    for (let i = 0; i < carPositions.length; i++) {
      ctx.fillStyle = carColors[i];
      ctx.beginPath();
      ctx.arc(
        carPositions[i][0] * s,
        carPositions[i][1] * s,
        5 * s,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  private drawDropTower(
    ctx: CanvasRenderingContext2D,
    s: number,
    color: string,
    time: number,
    isRunning: boolean,
  ): void {
    ctx.fillStyle = "#777";
    ctx.fillRect(-5 * s, -80 * s, 10 * s, 100 * s);

    ctx.fillStyle = "#555";
    ctx.fillRect(-8 * s, 15 * s, 16 * s, 8 * s);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -85 * s);
    ctx.lineTo(8 * s, -75 * s);
    ctx.lineTo(-8 * s, -75 * s);
    ctx.closePath();
    ctx.fill();

    const dropY = isRunning
      ? -80 * s + Math.abs(Math.sin(time * 0.005)) * 85 * s
      : -60 * s;
    ctx.fillStyle = color;
    ctx.fillRect(-12 * s, dropY, 24 * s, 10 * s);

    ctx.fillStyle = "#333";
    for (let i = -8; i <= 8; i += 4) {
      ctx.fillRect(i * s - 1.5 * s, dropY - 4 * s, 3 * s, 4 * s);
    }
  }

  private drawLogFlume(
    ctx: CanvasRenderingContext2D,
    s: number,
    color: string,
  ): void {
    ctx.fillStyle = "#2196f3";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-40 * s, 15 * s);
    ctx.quadraticCurveTo(-20 * s, 5 * s, 0, 10 * s);
    ctx.quadraticCurveTo(20 * s, 15 * s, 40 * s, 5 * s);
    ctx.lineTo(40 * s, 25 * s);
    ctx.lineTo(-40 * s, 25 * s);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#795548";
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = 1 * s;
    ctx.beginPath();
    ctx.moveTo(-40 * s, 10 * s);
    ctx.quadraticCurveTo(-20 * s, 0, 0, 5 * s);
    ctx.quadraticCurveTo(20 * s, 10 * s, 40 * s, 0);
    ctx.lineTo(40 * s, 15 * s);
    ctx.quadraticCurveTo(20 * s, 25 * s, 0, 20 * s);
    ctx.quadraticCurveTo(-20 * s, 15 * s, -40 * s, 25 * s);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillRect(-5 * s, 2 * s, 12 * s, 8 * s);

    ctx.fillStyle = "#666";
    ctx.beginPath();
    ctx.moveTo(20 * s, -30 * s);
    ctx.lineTo(30 * s, 5 * s);
    ctx.lineTo(10 * s, 5 * s);
    ctx.closePath();
    ctx.fill();
  }
}
