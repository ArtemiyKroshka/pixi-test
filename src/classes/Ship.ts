import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import {IShip} from "../interfaces/interfaces";

import {Constants} from "../enums/constants";
import {validateShipInDock, validateShipInPort} from "../utils/shipValidation";
import Dock from "./Dock";
import Port from "./Port";

export default class Ship {
  ship: IShip;

  constructor(x: number, y: number, full: boolean) {
    this.ship = new PIXI.Graphics();
    this.ship.position.set(x, y);
    this.ship.wasInDock = false;
    this.ship.waiting = false;
    this.ship.full = full;
    this.ship.dock = null;
    this.generateRandomFillShip();
  }

  getShip(): PIXI.Graphics {
    return this.ship;
  }

  initShip(app: PIXI.Application): void {
    app.stage.addChild(this.ship);
  }

  visitedDock(): void {
    this.ship.full = !this.ship.full;
    this.ship.wasInDock = true;
    this.updateShip();
  }

  setDock(dock: Dock): void {
    this.ship.dock = dock;
  }

  generateRandomFillShip(): void {
    const configShip = {
      alpha: this.ship.full ? 1 : 0,
      color: this.ship.full
        ? Constants.SHIP_COLOR_RED
        : Constants.SHIP_COLOR_GREEN,
    };

    this.drawShip(configShip);
  }

  drawShip({alpha, color}: {alpha: number; color: number}): void {
    this.ship.rect(0, 0, Constants.SHIP_WIDTH, Constants.SHIP_HEIGHT);
    this.ship.fill({color, alpha});
    this.ship.stroke({width: 2, color});
  }

  updateShip(): void {
    const configShip = {
      alpha: this.ship.full ? 1 : 0,
      color: !this.ship.full
        ? Constants.SHIP_COLOR_RED
        : Constants.SHIP_COLOR_GREEN,
    };
    this.ship.clear();
    this.drawShip(configShip);
  }

  move(posX: number, posY: number, callback: (ship: Ship) => void): void {
    const tween = new TWEEN.Tween(this.ship.position);
    tween.to({x: posX, y: posY}, Constants.ANIMATION_TIME);
    tween.onUpdate(({x, y}) => {
      this.ship.position.x = x;
      this.ship.position.y = y;
    });
    tween.onComplete(() => {
      if (typeof callback !== "function") return;
      callback(this);
    });
    tween.start();
  }

  moveToPort() {
    this.move(Constants.GATE_X, Constants.GATE_Y, (ship) =>
      validateShipInPort(ship)
    );
  }

  moveToDock(dock: Dock) {
    this.move(
      dock.dock.x + Constants.SHIP_WIDTH,
      dock.dock.y + Constants.DOCK_HEIGHT / 2,
      (ship) => validateShipInDock(ship, dock)
    );
  }

  moveToQueue(port: Port) {
    const queueName = this.ship.full ? "redShipsQueue" : "greenShipsQueue";
    const queuePlace =
      port[queueName].length > 0
        ? Constants.QUEUE_X +
          (Constants.SHIP_WIDTH + Constants.DOCK_GAP) * port[queueName].length
        : Constants.QUEUE_X;
    this.move(
      queuePlace,
      this.ship.full ? Constants.RED_QUEUE_Y : Constants.GREEN_QUEUE_Y,
      (ship) => {
        ship.ship.waiting = true;
        port[queueName].push(ship);
      }
    );
  }

  moveAway(app: PIXI.Application) {
    this.move(
      app.renderer.width - Constants.SHIP_WIDTH,
      Constants.GATE_Y,
      (ship) => app.stage.removeChild(ship.getShip())
    );
  }
}
