import { Component, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import { DrawingService } from './services/drawing.service';
import { RoomComponent } from './components/room.component';
import { SharedDeskComponent } from './components/shared-desk.component';
import { ChairComponent } from './components/chair.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  toggleTips(): void {
    if (document.body.classList.contains('tipsOpen')) {
      document.body.classList.remove('tipsOpen');
    } else {
      document.body.classList.add('tipsOpen');
    }
  }

  toggleDarkTheme(): void {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      this.canvas.getObjects().forEach((e) => {
        e.stroke = 'black';
        e.dirty = true;
      });
    } else {
      document.body.classList.add('dark-theme');
      this.canvas.getObjects().forEach((e) => {
        e.stroke = 'white';
        e.dirty = true;
      });
    }
    this.darkMode = !this.darkMode;
    this.canvas.renderAll();
  }

  grundrissButtons = [{ id: 1, image: 'assets/img/grundriss.svg' }];

  raeumeButtons = [
    { id: 1, image: 'assets/img/room1.svg' },
    { id: 2, image: 'assets/img/room2.svg' },
  ];
  sharedDeskButtons = [
    { id: 1, image: 'assets/img/desk1.svg' },
    { id: 2, image: 'assets/img/desk2.svg' },
  ];

  stuehleButtons = [{ id: 1, image: 'assets/img/chair.svg' }];

  private title = 'Testit';
  private canvas!: fabric.Canvas;
  private drawingService!: DrawingService;
  private roomComponent!: RoomComponent;
  private sharedDeskComponent!: SharedDeskComponent;
  private chairComponent!: ChairComponent;
  public activeCategory: { [key: string]: number | null } = {};
  private isCategoryActive: boolean = false;
  public darkMode = false;

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  initCanvas = () => {
    this.canvas = new fabric.Canvas('myCanvas');
    this.canvas.setDimensions({
      width: 1600,
      height: 800,
    });

    this.canvas.preserveObjectStacking = true;
    this.canvas.stopContextMenu = true;

    this.drawingService = new DrawingService(this.canvas);
    this.roomComponent = new RoomComponent(this.canvas, this.drawingService);
    this.sharedDeskComponent = new SharedDeskComponent(this.canvas);
    this.chairComponent = new ChairComponent(this.canvas);

    this.drawingService.setupDrawing();

    this.canvas.on('mouse:down', (event: fabric.IEvent) => {
      const mouseEvent = event.e as MouseEvent;
      const canvasCoords = this.getCanvasCoords(mouseEvent);
      this.handleCanvasClick(canvasCoords);
    });
  };

  toggleActiveCategory(category: string, buttonId: number): void {
    this.activeCategory[category] =
      this.activeCategory[category] === buttonId ? null : buttonId;

    this.isCategoryActive = this.activeCategory[category] !== null;
  }

  isActiveCategory(category: string, buttonId: number): boolean {
    return this.activeCategory[category] === buttonId;
  }

  getButtonById(category: string, buttonId: number): any {
    switch (category) {
      case 'Raeume':
        return this.raeumeButtons.find((button) => button.id === buttonId);
      case 'SharedDesk':
        return this.sharedDeskButtons.find((button) => button.id === buttonId);
      case 'Stuehle':
        return this.stuehleButtons.find((button) => button.id === buttonId);
      default:
        return null;
    }
  }

  private getCanvasCoords(mouseEvent: MouseEvent): { x: number; y: number } {
    const canvasElement = this.canvas.getElement();
    const canvasBoundingRect = canvasElement.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - canvasBoundingRect.left,
      y: mouseEvent.clientY - canvasBoundingRect.top,
    };
  }

  private handleCanvasClick(coords: { x: number; y: number }): void {
    for (const category in this.activeCategory) {
      if (Object.prototype.hasOwnProperty.call(this.activeCategory, category)) {
        const buttonId = this.activeCategory[category];
        if (buttonId !== null) {
          this.handleButtonClick(
            category,
            this.getButtonById(category, buttonId),
            coords
          );
        }
      }
    }
  }

  handleButtonClick(
    category: string,
    button: any,
    coords: { x: number; y: number }
  ): void {
    if (this.isCategoryActive) {
      switch (category) {
        case 'Raeume':
          this.addRoom(button, coords);
          break;
        case 'SharedDesk':
          this.addSharedDesk(button, coords);
          break;
        case 'Stuehle':
          this.addChair(button, coords);
          break;
        default:
          break;
      }
      this.isCategoryActive = false;
      this.activeCategory[category] = null;
    }
  }

  startDrawing = () => {
    this.drawingService.startDrawing();
  };

  addSharedDesk = (button: any, coords: { x: number; y: number }) => {
    switch (button.id) {
      case 1:
        return this.sharedDeskComponent.addSharedDesk(coords);
      case 2:
        return this.sharedDeskComponent.addRoundDesk(coords);
      default:
        return null;
    }
  };

  addRoom = (button: any, coords: { x: number; y: number }) => {
    switch (button.id) {
      case 1:
        return this.roomComponent.addRoom1(coords);
      case 2:
        return this.roomComponent.addRoom2(coords);
      default:
        return null;
    }
  };

  addChair = (button: any, coords: { x: number; y: number }) => {
    this.chairComponent.addChair(coords);
  };

  isActionButtonVisible(): boolean {
    return !!this.canvas && this.canvas!.getActiveObjects().length > 0;
  }

  remove = () => {
    let activeObjects = this.canvas.getActiveObjects();
    this.canvas.discardActiveObject();
    if (activeObjects.length) {
      this.canvas.remove.apply(this.canvas, activeObjects);
    }
  };

  clone = () => {
    let activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      activeObjects.forEach((object) => {
        object.clone((clone: fabric.Object) => {
          if (object.group) {
            let clonePosition = new fabric.Point(
              object.left! + object.group.left! + 200,
              object.top! + object.group.top!
            );

            this.canvas.add(
              clone.set({
                left: clonePosition.x,
                top: clonePosition.y,
              })
            );
          } else {
            this.canvas.add(
              clone.set({
                left: object.left! + 200,
                top: object.top,
              })
            );
          }
        });
      });
    }
  };
}
