import { Camera } from "../core/Camera";
import { TileRenderer } from "./TileRenderer";
import { RideRenderer } from "./RideRenderer";
import { SceneryRenderer } from "./SceneryRenderer";
import { GuestRenderer } from "./GuestRenderer";
import { OverlayRenderer } from "./OverlayRenderer";
import { ParticleRenderer } from "./ParticleRenderer";
import { TileMap } from "../world/TileMap";
import type { RideInstance, SceneryInstance, Guest, Particle, TileCoord, RideDefinition } from "../types";
import { ToolMode } from "../types";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  tileRenderer = new TileRenderer();
  rideRenderer = new RideRenderer();
  sceneryRenderer = new SceneryRenderer();
  guestRenderer = new GuestRenderer();
  overlayRenderer = new OverlayRenderer();
  particleRenderer = new ParticleRenderer();

  constructor(ctx: CanvasRenderingContext2D, camera: Camera) {
    this.ctx = ctx;
    this.camera = camera;
  }

  clear(): void {
    this.ctx.fillStyle = "#1a1a2e";
    this.ctx.fillRect(0, 0, this.camera.width, this.camera.height);
  }

  renderTiles(tileMap: TileMap): void {
    this.tileRenderer.render(this.ctx, tileMap.tiles, this.camera);
  }

  renderRides(rides: RideInstance[], time: number): void {
    this.rideRenderer.render(this.ctx, rides, this.camera, time);
  }

  renderScenery(items: SceneryInstance[]): void {
    this.sceneryRenderer.render(this.ctx, items, this.camera);
  }

  renderGuests(guests: Guest[], time: number): void {
    this.guestRenderer.render(this.ctx, guests, this.camera, time);
  }

  renderOverlay(
    hoveredTile: TileCoord | null,
    toolMode: ToolMode,
    tileMap: TileMap,
    rideDef: RideDefinition | null,
  ): void {
    this.overlayRenderer.renderHover(this.ctx, this.camera, hoveredTile, toolMode, tileMap, rideDef);
    this.overlayRenderer.renderEntrance(this.ctx, this.camera);
  }

  renderParticles(particles: Particle[]): void {
    this.particleRenderer.render(this.ctx, particles);
  }

  renderMinimap(tileMap: TileMap): void {
    this.overlayRenderer.renderMinimap(
      this.ctx,
      tileMap,
      this.camera,
      this.camera.width,
      this.camera.height,
    );
  }

  renderNightOverlay(timeOfDay: number): void {
    const nightness = Math.max(0, Math.sin((timeOfDay - 0.25) * Math.PI * 2) * 0.3);
    if (nightness > 0) {
      this.ctx.fillStyle = `rgba(0, 0, 30, ${nightness})`;
      this.ctx.fillRect(0, 0, this.camera.width, this.camera.height);
    }
  }
}
