"use strict";
// This script creates a pacman-like entity on the screen which cosntantly follows the mouse at an acceleration with a max StereoPannerNode
// The pacman also is always facing the mouse and storing its lookin direction and this defines a vision cone by angle
// every html element on the page has a fear() event which gets called every 0.1 sec. if the global pacman has it inside its vision cone (if the line of sight has a small degree variance to pacmans direction) then the element will get the css class "fears"
// elements of the css class fears will have a shaking animation and have their saturation halved

import { createElement } from "./dom_utils.js";

class Pacman {
  constructor(id, colorHEX, appliedClasses) {
    this.id = id;
    this.colorHEX = colorHEX;
    this.iconRotation = 0;
    this.appliedClasses = appliedClasses;

    this.speedX = 0;
    this.speedY = 0;
    this.lookDir = 45;
    this.currSpeed = 0;
    this.maxSpeed = 950;
    this.accelerationPerSec = 1500;
    this.targetDir = 0;

    this.lastUpdateMs = Date.now();

    this.element = createElement(
      "div",
      ["pacman", "flex", "flex-center-center"],
      "",
      document.body,
      "pacman_" + this.colorHEX.split("#")[1]
    );
    const icon = createElement(
      "h1",
      ["pacman-icon", "consolas", "pos-relative"],
      "<i class='bi bi-rocket'></i>",
      this.element
    );
    this.icon = icon;
    this.initialized = false;
    this.element.PMObject = this;

    document.body.addEventListener("mousemove", (evnt) => {
      const PMObject = this;
      if (!PMObject.initialized) {
        PMObject.init(evnt);
        PMObject.initialized = true;
      } else {
        PMObject.update(evnt);
      }
    });
  }

  init(evnt) {
    //  TO-DO add pacman cherry in top right, which on hover spawns pacman through a zoom in fade animation
    const style = this.element.style;
    // TO-DO re-activate pointerEvents
    style.pointerEvents = "none";
    style.color = this.colorHEX;
    style.position = "absolute";
    style.transform = "translate(-50%, -50%)";

    this.moveTo(
      ~~(window.innerWidth / 2),
      ~~(window.scrollY + window.innerHeight / 2)
    );

    this.lastUpdateMs = Date.now();
    console.log("initializing Pacman");
  }
  update(evnt) {
    const now = Date.now();
    const timeDeltaSec = (now - this.lastUpdateMs) / 1000;

    console.log(
      "updating Pacman",
      this.element.style.top,
      this.element.style.left
    );

    this.setTargetDir(evnt);
    this.applyAcceleration(timeDeltaSec);
    this.updatePos(timeDeltaSec);

    this.lastUpdateMs = now;
  }

  clicked() {
    // TO-DO do some fancy run away animation
  }

  setTargetDir(evnt) {
    this.targetDir = this.angleCWFromUp(this.getPos(), this.getMousePos(evnt));
    console.log(" - updating targetDir", this.targetDir);
  }

  applyAcceleration(timeDeltaSec) {
    const accelSpeed = this.accelerationPerSec * timeDeltaSec;
    const rad = (this.targetDir * Math.PI) / 180;
    const pushX = accelSpeed * Math.sin(rad);
    const pushY = -accelSpeed * Math.cos(rad);
    this.speedX += pushX;
    this.speedY += pushY;
    // after modifying this.speedX/Y in applyAcceleration:
    const speed = Math.hypot(this.speedX, this.speedY);
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.speedX *= scale;
      this.speedY *= scale;
    }
  }

  updatePos(timeDeltaSec) {
    const deltaX = this.speedX * timeDeltaSec;
    const deltaY = this.speedY * timeDeltaSec;
    const oldPos = this.getPos();
    this.move(deltaX, deltaY);
    console.log(" - Pos change: ", deltaX, deltaY);
    this.updateFacingDirection(oldPos, this.getPos());
  }

  getMousePos(evnt) {
    return [evnt.pageX, evnt.pageY];
  }

  getPos() {
    const rect = this.element.getBoundingClientRect();
    // return [centerX, centerY] in page coordinates
    const x = Math.round(rect.left + rect.width / 2 + window.scrollX);
    const y = Math.round(rect.top + rect.height / 2 + window.scrollY);
    return [x, y];
  }

  updateFacingDirection(oldPos, newPos) {
    this.lookDir = this.angleCWFromUp(oldPos, newPos);
    this.icon.style.transform = `rotate(${this.lookDir}deg)`;
  }

  angleCWFromUp(fromPos, targetPos) {
    //chatGPT
    console.log(fromPos, targetPos);

    const dx = targetPos[0] - fromPos[0];
    const dy = -(targetPos[1] - fromPos[1]);
    // atan2 returns angle from +x axis CCW; we need from +y axis CW
    // step1: get angle from +x axis CCW
    let theta = Math.atan2(dy, dx); // radians, range (-PI, PI]
    // step2: convert to angle from +y axis CW:
    // angleCW = (90deg - theta_in_deg) mod 360
    let deg = (90 - (theta * 180) / Math.PI) % 360;
    console.log("[angle]: ", dx, dy, deg, "deg");

    if (deg < 0) deg += 360;
    return deg;
  }

  move(deltaX, deltaY) {
    const currPos = this.getPos();
    this.moveTo(currPos[0] + deltaX, currPos[1] + deltaY);
  }

  moveTo(newX, newY) {
    const style = this.element.style;
    style.top = newY + "px";
    style.left = newX + "px";
  }
}

export function createPacMan() {
  const PM1 = new Pacman("PM1", "#f3b918ff", ["shake"]);
  const PM2 = new Pacman("PM2", "#18ecf3ff", ["dark"]);
  const PM3 = new Pacman("PM3", "#f3189fff", ["contrast"]);
  const PM9 = new Pacman("PM3", "#000000ff", ["rot90"]);
}
