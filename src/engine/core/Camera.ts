import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP, PAN_SPEED } from "../constants";

export class Camera {
  x = 0;
  y = 0;
  zoom = 1;
  width = 0;
  height = 0;

  private keys = new Set<string>();

  centerOn(worldX: number, worldY: number): void {
    this.x = worldX - this.width / 2 / this.zoom;
    this.y = worldY - this.height / 2 / this.zoom;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  zoomIn(): void {
    this.zoom = Math.min(MAX_ZOOM, this.zoom + ZOOM_STEP);
  }

  zoomOut(): void {
    this.zoom = Math.max(MIN_ZOOM, this.zoom - ZOOM_STEP);
  }

  zoomAt(delta: number, screenX: number, screenY: number): void {
    const worldBefore = this.screenToWorld(screenX, screenY);
    if (delta < 0) {
      this.zoom = Math.min(MAX_ZOOM, this.zoom + ZOOM_STEP);
    } else {
      this.zoom = Math.max(MIN_ZOOM, this.zoom - ZOOM_STEP);
    }
    const worldAfter = this.screenToWorld(screenX, screenY);
    this.x += worldBefore.x - worldAfter.x;
    this.y += worldBefore.y - worldAfter.y;
  }

  screenToWorld(sx: number, sy: number): { x: number; y: number } {
    return {
      x: sx / this.zoom + this.x,
      y: sy / this.zoom + this.y,
    };
  }

  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: (wx - this.x) * this.zoom,
      y: (wy - this.y) * this.zoom,
    };
  }

  onKeyDown(key: string): void {
    this.keys.add(key.toLowerCase());
  }

  onKeyUp(key: string): void {
    this.keys.delete(key.toLowerCase());
  }

  update(): void {
    const speed = PAN_SPEED / this.zoom;
    if (this.keys.has("w") || this.keys.has("arrowup")) this.y -= speed;
    if (this.keys.has("s") || this.keys.has("arrowdown")) this.y += speed;
    if (this.keys.has("a") || this.keys.has("arrowleft")) this.x -= speed;
    if (this.keys.has("d") || this.keys.has("arrowright")) this.x += speed;
  }
}
