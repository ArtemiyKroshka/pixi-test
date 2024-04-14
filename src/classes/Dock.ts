import * as PIXI from "pixi.js";
import {Constants} from "../enums/constants";
import Ship from "./Ship";

export default class Dock {
  dock: PIXI.Graphics;
  currentShip: Ship | null;
  full: boolean;

  constructor(x: number, y: number) {
    this.dock = new PIXI.Graphics();
    this.dock.position.set(x, y);
    this.currentShip = null;
    this.full = false;
    this.drawDock();
  }

  drawDock(): void {
    const alpha = this.full ? 1 : 0;
    this.dock.rect(0, 0, Constants.DOCK_WIDTH, Constants.DOCK_HEIGHT);
    this.dock.fill({color: Constants.DOCK_COLOR, alpha});
    this.dock.stroke({
      width: Constants.DOCK_LINE,
      color: Constants.DOCK_COLOR,
    });
  }

  updateDock(): void {
    this.dock.clear();
    this.drawDock();
  }

  setCurrentShip(ship: Ship): void {
    this.currentShip = ship;
  }

  arrivedShip(ship: Ship): void {
    this.full = ship.ship.full!;
    this.updateDock();
    ship.visitedDock();
  }

  unloadShip(): void {
    this.currentShip = null;
  }

  initDock(container: PIXI.Container): void {
    container.addChild(this.dock);
  }
}
