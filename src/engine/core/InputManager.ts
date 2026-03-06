import { Camera } from "./Camera";
import { TilePicker } from "./TilePicker";

export type ClickHandler = (col: number, row: number) => void;
export type DragHandler = (col: number, row: number) => void;
export type HoverHandler = (col: number, row: number) => void;

export class InputManager {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private tilePicker: TilePicker;
  private onClick: ClickHandler;
  private onDrag: DragHandler;
  private onHover: HoverHandler;
  private isDragging = false;
  private lastDragTile: { col: number; row: number } | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    camera: Camera,
    tilePicker: TilePicker,
    onClick: ClickHandler,
    onDrag: DragHandler,
    onHover: HoverHandler,
  ) {
    this.canvas = canvas;
    this.camera = camera;
    this.tilePicker = tilePicker;
    this.onClick = onClick;
    this.onDrag = onDrag;
    this.onHover = onHover;
  }

  attach(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mouseleave", this.handleMouseUp);
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  detach(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mouseleave", this.handleMouseUp);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0) return;
    const tile = this.tilePicker.pick(e.offsetX, e.offsetY, this.camera);
    if (tile) {
      this.isDragging = true;
      this.lastDragTile = tile;
      this.onClick(tile.col, tile.row);
    }
  };

  private handleMouseMove = (e: MouseEvent): void => {
    const tile = this.tilePicker.pick(e.offsetX, e.offsetY, this.camera);
    if (tile) {
      this.onHover(tile.col, tile.row);
      if (this.isDragging) {
        if (
          !this.lastDragTile ||
          this.lastDragTile.col !== tile.col ||
          this.lastDragTile.row !== tile.row
        ) {
          this.lastDragTile = tile;
          this.onDrag(tile.col, tile.row);
        }
      }
    }
  };

  private handleMouseUp = (): void => {
    this.isDragging = false;
    this.lastDragTile = null;
  };

  private handleWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.camera.zoomAt(e.deltaY, e.offsetX, e.offsetY);
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    this.camera.onKeyDown(e.key);
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.camera.onKeyUp(e.key);
  };
}
