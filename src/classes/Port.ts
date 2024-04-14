import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";

import Ship from "./Ship";
import Dock from "./Dock";

import {Constants} from "../enums/constants";

export default class Port {
  private port: PIXI.Container;
  docks: Dock[] = [];
  greenShipsQueue: Ship[] = [];
  redShipsQueue: Ship[] = [];

  constructor(app: PIXI.Application) {
    this.port = new PIXI.Container();

    for (let i = 0; i < Constants.DOCKS_NUMBER; i++) {
      const dock = new Dock(
        0,
        (Constants.DOCK_HEIGHT + Constants.DOCK_GAP) * i
      );
      dock.initDock(this.port);
      this.docks.push(dock);
    }

    const top = new PIXI.Graphics();
    top.position.set(Constants.GATE_X, 0);
    top.rect(0, 0, 20, app.renderer.height / 2 - 150);
    top.fill({color: Constants.DOCK_COLOR});
    top.stroke({width: 2, color: Constants.DOCK_COLOR});
    app.stage.addChild(top);

    const bottom = new PIXI.Graphics();
    bottom.position.set(Constants.GATE_X, app.renderer.height / 2 + 100); // Fixed Y coordinate
    bottom.rect(0, 0, 20, app.renderer.height / 2);
    bottom.fill({color: Constants.DOCK_COLOR});
    bottom.stroke({width: 2, color: Constants.DOCK_COLOR});
    app.stage.addChild(bottom);

    app.stage.addChild(this.port);

    this.generateShip(app);
    setInterval(() => this.generateShip(app), Constants.SHIP_INTERVAL_TIME);
  }

  generateShip(app: PIXI.Application) {
    const INITIAL_COORDINATES = {
      x: app.renderer.width - Constants.SHIP_WIDTH,
      y: Constants.GATE_Y,
    };
    const full = Math.random() < 0.5;

    const ship = new Ship(INITIAL_COORDINATES.x, INITIAL_COORDINATES.y, full);

    ship.initShip(app);

    ship.moveToPort();
  }

  handleQueue(dock: Dock): void {
    if (dock.full) {
      if (this.greenShipsQueue.length) {
        const ship: Ship = this.greenShipsQueue[0];
        this.greenShipsQueue.shift();
        ship.moveToPort();
        this.updateQueue(this.greenShipsQueue);
      }
    } else {
      if (this.redShipsQueue.length) {
        const ship: Ship = this.redShipsQueue[0];
        this.redShipsQueue.shift();
        ship.moveToPort();
        this.updateQueue(this.redShipsQueue);
      }
    }
  }

  updateQueue(queueArray: Ship[]) {
    queueArray.forEach((ship) => {
      const queueType = ship.ship.full
        ? Constants.RED_QUEUE_Y
        : Constants.GREEN_QUEUE_Y;
      const tween = new TWEEN.Tween(ship.ship.position).to({
        x: ship.ship.x - Constants.SHIP_WIDTH,
        y: queueType,
      });
      tween.start();
    });
  }
}
