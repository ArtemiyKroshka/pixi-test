import Port from "./classes/Port";
import "./style.css";
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";

export const app = new PIXI.Application();
await app.init({
  resizeTo: window,
  background: "0x00336699",
});

document.body.appendChild(app.canvas);

const animate = () => {
  requestAnimationFrame(animate);
  TWEEN.update();
};

animate();

export const port = new Port(app);
