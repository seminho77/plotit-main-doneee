import { fabric } from 'fabric';

export class DrawnPoint extends fabric.Circle {
    constructor(left: number, top: number) {
        super({
            left,
            top,
            radius: 3,
            fill: document.body.classList.contains("dark-theme") ? "white" : "black",
            selectable: false,
        });
    }
}
