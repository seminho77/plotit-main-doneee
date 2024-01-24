import { fabric } from 'fabric';
import { DrawingService } from '../services/drawing.service';

export class RoomComponent {
  constructor(
    private canvas: fabric.Canvas,
    private drawingService: DrawingService
  ) {}

  addRoom1(coords: { x: number; y: number }): void {
    const room = new fabric.Rect({
      left: coords.x,
      top: coords.y,
      fill: 'rgba(255, 255, 255, 0)',
      width: 100,
      height: 100,
      originX: 'center',
      originY: 'center',
      strokeWidth: 2,
      stroke: document.body.classList.contains('dark-theme')
        ? 'white'
        : 'black',
      strokeUniform: true,
    });

    const table = new fabric.Rect({
      left: room.left,
      top: room.top,
      fill: 'rgba(255, 255, 255, 0)',
      width: 25,
      height: 50,
      originX: 'center',
      originY: 'center',
      strokeWidth: 2,
      stroke: document.body.classList.contains('dark-theme')
        ? 'white'
        : 'black',
      strokeUniform: true,
    });

    const chairPositions = [
      { offsetLeft: -20, offsetTop: 0 },
      { offsetLeft: -20, offsetTop: -15 },
      { offsetLeft: -20, offsetTop: 15 },
      { offsetLeft: 20, offsetTop: 0 },
      { offsetLeft: 20, offsetTop: 15 },
      { offsetLeft: 20, offsetTop: -15 },
      { offsetLeft: 0, offsetTop: -31 },
      { offsetLeft: 0, offsetTop: 31 },
    ];

    const chairs = chairPositions.map(
      (pos) =>
        new fabric.Circle({
          left: table.left! + pos.offsetLeft,
          top: table.top! + pos.offsetTop,
          fill: 'rgba(255, 255, 255, 0)',
          radius: 5,
          originX: 'center',
          originY: 'center',
          strokeWidth: 2,
          stroke: document.body.classList.contains('dark-theme')
            ? 'white'
            : 'black',
          strokeUniform: true,
        })
    );

    this.canvas.add(room, table, ...chairs);
    console.log('Objects on Canvas: ', this.canvas.getObjects());
  }

  addRoom2(coords: { x: number; y: number }): void {
    const room = new fabric.Rect({
      left: coords.x,
      top: coords.y,
      fill: 'rgba(255, 255, 255, 0)',
      width: 100,
      height: 100,
      originX: 'center',
      originY: 'center',
      strokeWidth: 2,
      stroke: document.body.classList.contains('dark-theme')
        ? 'white'
        : 'black',
    });

    const desk = new fabric.Circle({
      left: room.left,
      top: room.top,
      fill: 'rgba(255, 255, 255, 0)',
      radius: 25,
      originX: 'center',
      originY: 'center',
      strokeWidth: 2,
      stroke: document.body.classList.contains('dark-theme')
        ? 'white'
        : 'black',
    });

    this.canvas.add(room, desk);

    const chairPositions = [
      { angle: 45, distance: 32 },
      { angle: 135, distance: 32 },
      { angle: 225, distance: 32 },
      { angle: 315, distance: 32 },
    ];

    chairPositions.forEach((pos) => {
      const radians = fabric.util.degreesToRadians(pos.angle);
      const chair = new fabric.Circle({
        left: desk.left! + pos.distance * Math.cos(radians),
        top: desk.top! + pos.distance * Math.sin(radians),
        fill: 'rgba(255, 255, 255, 0)',
        radius: 5,
        originX: 'center',
        originY: 'center',
        strokeWidth: 2,
        stroke: document.body.classList.contains('dark-theme')
          ? 'white'
          : 'black',
      });
      this.canvas.add(chair);
    });
  }
}
