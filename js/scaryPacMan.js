"use strict";
// This script creates a pacman-like entity on the screen which cosntantly follows the mouse at an acceleration with a max StereoPannerNode
// The pacman also is always facing the mouse and storing its lookin direction and this defines a vision cone by angle
// every html element on the page has a fear() event which gets called every 0.1 sec. if the global pacman has it inside its vision cone (if the line of sight has a small degree variance to pacmans direction) then the element will get the css class "fears"
// elements of the css class fears will have a shaking animation and have their saturation halved

import { createElement } from "./dom_utils.js";

class Pacman {
  constructor(id, colorHEX) {
    this.id = id;
    this.colorHEX = colorHEX;
    this.iconRotation = 0;

    this.speedX = 0;
    this.speedY = 0;
    this.lookDir = 45;
    this.currSpeed = 0;
    this.maxSpeed = 40;
    this.accelerationPerSec = 10;
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
      "VVV",
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

    console.log("initializing Pacman");
  }
  update(evnt) {
    const style = this.element.style;

    console.log("updating Pacman", style.top, style.left);
    this.setTargetAcceleration(evnt);
    this.applyAcceleration();
    this.updatePos();
    this.lastUpdateMs = Date.now();
  }

  clicked() {
    // TO-DO do some fancy run away animation
  }

  setTargetAcceleration(evnt) {
    this.targetDir = this.angleCWFromUp(this.getPos(), this.getMousePos(evnt));
    console.log(" - updating targetDir", this.targetDir);
  }

  applyAcceleration() {
    const timeDeltaSec = (Date.now() - this.lastUpdateMs) / 1000;
    const accelSpeed = this.accelerationPerSec * timeDeltaSec;
    const pushX = accelSpeed * Math.cos(this.targetDir);
    const pushY = accelSpeed * Math.sin(this.targetDir);
    this.speedX += pushX;
    this.speedY += pushY;
    console.log(
      " - applying Acceleration",
      timeDeltaSec,
      "sec",
      accelSpeed,
      "speed"
    );
    console.log("   - speed before", this.speedX, this.speedY);
    console.log("   - updating targetPush", pushX, pushY);
    console.log("   - speed before", this.speedX, this.speedY);
  }

  updatePos() {
    const timeDeltaSec = (Date.now() - this.lastUpdateMs) / 1000;
    this.speedX = this.currSpeed * Math.cos(this.lookDir);
    this.speedY = this.currSpeed * Math.sin(this.lookDir);
    const deltaX = this.speedX * timeDeltaSec;
    const deltaY = this.speedY * timeDeltaSec;
    const oldPos = this.getPos();
    this.move(deltaX, deltaY);
    const newPos = this.getPos();
    this.updateFacingDirection(oldPos, newPos);
  }

  getMousePos(evnt) {
    return [evnt.pageX, evnt.pageY];
  }

  getPos() {
    const style = this.element.style;
    return [parseInt(style.left), parseInt(style.top)];
  }

  updateFacingDirection(oldPos, newPos) {
    this.lookDir = this.angleCWFromUp(oldPos, newPos);
    this.icon.style.transform = `rotate(${this.lookDir}deg)`;
  }

  angleCWFromUp(fromPos, targetPos) {
    //chatGPT
    console.log(fromPos, targetPos);

    const dx = targetPos[0] - fromPos[0];
    const dy = targetPos[1] - fromPos[1];
    // atan2 returns angle from +x axis CCW; we need from +y axis CW
    // step1: get angle from +x axis CCW
    let theta = Math.atan2(dy, dx); // radians, range (-PI, PI]
    // step2: convert to angle from +y axis CW:
    // angleCW = (90deg - theta_in_deg) mod 360
    let deg = (90 - (-theta * 180) / Math.PI) % 360;
    console.log("[angle]: ", dx, dy, deg, "deg");

    if (deg < 0) deg += 360;
    return deg;
  }

  move(deltaX, deltaY) {
    const currPos = this.getPos();
    moveTo(currPos[0] + deltaX, currPos[1] + deltaY);
  }

  moveTo(newX, newY) {
    const style = this.element.style;
    style.top = newY + "px";
    style.left = newX + "px";
  }
}

export function createPacMan() {
  const PM1 = new Pacman("PM1", "#f3e418ff");
}
