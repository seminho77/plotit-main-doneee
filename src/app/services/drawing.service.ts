import {fabric} from 'fabric';
import {DrawnPoint} from '../model/drawn-point.model';

export class DrawingService {
  private isDrawing = false;
  private points: fabric.Point[] = [];
  private drawnPoints: DrawnPoint[] = [];
  private polygonCreated = false;

  constructor(private canvas: fabric.Canvas) {
  }

  setupDrawing(): void {
    const clickTolerance = 10;

    this.canvas.on('mouse:down', (options) => {
      if (!this.polygonCreated && this.isDrawing) {
        const pointer = this.canvas.getPointer(options.e);
        const newPoint = new fabric.Point(pointer.x, pointer.y);

        if (!this.isDrawing) {
          this.isDrawing = true;
          this.points = [];
          this.clearDrawnPoints();
        }

        const drawnPoint = new DrawnPoint(pointer.x, pointer.y);
        this.drawnPoints.push(drawnPoint);
        this.canvas.add(drawnPoint);

        if (this.isDrawing && this.points.length > 2 && this.isNearFirstPoint(newPoint, clickTolerance)) {
          this.createPolygon(this.points);

          this.isDrawing = false;
          this.clearDrawnPoints();
          this.points = [];
          this.polygonCreated = true;
        } else if (this.isDrawing) {
          this.points.push(newPoint);
        }
      }
    });
  }

  isNearFirstPoint(newPoint: fabric.Point, tolerance: number): boolean {
    const distance = Math.sqrt(
      Math.pow(this.points[0].x - newPoint.x, 2) +
      Math.pow(this.points[0].y - newPoint.y, 2)
    );
    return distance <= tolerance;
  }

  createPolygon(points: fabric.Point[]): void {
    const polygon = new fabric.Polygon(points, {
      fill: "rgba(255, 255, 255, 0)",
      stroke: document.body.classList.contains("dark-theme") ? "white" : "black",
      strokeWidth: 6,
      strokeUniform: true
    });

    this.canvas.add(polygon);
  }

  clearDrawnPoints(): void {
    this.drawnPoints.forEach((point) => {
      this.canvas.remove(point);
    });

    this.drawnPoints = [];
  }

  startDrawing(): void {
    this.isDrawing = true;
    this.points = [];
    this.clearDrawnPoints();
    this.polygonCreated = false;
  }
}
