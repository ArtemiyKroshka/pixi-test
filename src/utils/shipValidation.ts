import Dock from "../classes/Dock";
import Ship from "../classes/Ship";
import {Constants} from "../enums/constants";
import {app, port} from "../main";

export const validateShipInDock = (ship: Ship, dock: Dock): void => {
  dock.arrivedShip(ship);
  setTimeout(() => {
    ship.moveToPort();
    port.handleQueue(dock);
  }, Constants.STAY_IN_PORT_TIME);
};

export const validateShipInPort = (ship: Ship): void => {
  if (ship.ship.wasInDock) {
    ship.ship.dock!.unloadShip();
    ship.moveAway(app);
  } else {
    const dockCondition = ship.ship.full
      ? (dock: Dock) => !dock.currentShip && !dock.full
      : (dock: Dock) => !dock.currentShip && dock.full;
    const freeDock = port.docks.find(dockCondition);
    if (freeDock) {
      freeDock.setCurrentShip(ship);
      ship.setDock(freeDock);
      ship.moveToDock(ship.ship.dock!);
    } else {
      ship.moveToQueue(port);
    }
  }
};
