import { fabric } from 'fabric';

export class ChairComponent {
  constructor(private canvas: fabric.Canvas) {}

  addChair(coords: { x: number; y: number }): void {
    this.canvas.add(
      new fabric.Circle({
        left: coords.x,
        top: coords.y,
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
    console.log('Objects on Canvas: ', this.canvas.getObjects());
  }
}
