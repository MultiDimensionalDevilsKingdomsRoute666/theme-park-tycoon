export class GameLoop {
  private animFrameId = 0;
  private lastTime = 0;
  private onUpdate: (dt: number) => void;
  private onRender: () => void;
  running = false;

  constructor(onUpdate: (dt: number) => void, onRender: () => void) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min(now - this.lastTime, 50);
    this.lastTime = now;
    this.onUpdate(dt);
    this.onRender();
    this.animFrameId = requestAnimationFrame(this.tick);
  };
}
