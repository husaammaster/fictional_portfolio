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
    this.lookDir = 0;
    this.currSpeed = 0;
    this.maxSpeed = 40;
    this.accelerationPerSec = 10;
    this.targetDir = 0;

    this.element = createElement(
      "div",
      ["pacman"],
      "",
      document.body,
      "pacman_" + this.colorHEX.split("#")[1]
    );
    const icon = createElement(
      "h1",
      ["pacman-icon", "consolas"],
      "VVV",
      this.element
    );

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
    style.pointerEvents = "none";
    style.color = this.colorHEX;
    style.position = "absolute";
    style.top = ~~(window.scrollY + window.innerHeight / 2) + "px";
    style.left = ~~(window.innerWidth / 2) + "px";
    style.transform = "translate(-50%, -50%)";

    console.log("initializing Pacman");
  }
  update(evnt) {
    const style = this.element.style;
    style.top = evnt.pageY + "px";
    style.left = evnt.pageX + "px";
    console.log("updating Pacman", this.element, style.top, style.left);
  }

  clicked() {
    // TO-DO do some fancy run away animation
  }
}

export function createPacMan() {
  const PM1 = new Pacman("PM1", "#f3e418ff");
}
