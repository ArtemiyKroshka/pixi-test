import * as PIXI from "pixi.js";
import Dock from "../classes/Dock";

export interface IShip extends PIXI.Graphics {
  wasInDock?: boolean;
  full?: boolean;
  dock?: Dock | null;
  waiting?: boolean;
}
