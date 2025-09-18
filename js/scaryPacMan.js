"use strict";
// This script creates a pacman-like entity on the screen which cosntantly follows the mouse at an acceleration with a max StereoPannerNode
// The pacman also is always facing the mouse and storing its lookin direction and this defines a vision cone by angle
// every html element on the page has a fear() event which gets called every 0.1 sec. if the global pacman has it inside its vision cone (if the line of sight has a small degree variance to pacmans direction) then the element will get the css class "fears"
// elements of the css class fears will have a shaking animation and have their saturation halved

import { createElement } from "./dom_utils.js";
import globData from "./globData.js";
import { getRndInteger } from "./design.js";

class Pacman {
  constructor(id, colorHEX, appliedClasses, framerate = 30) {
    this.id = id;
    this.name = this.id;
    this.colorHEX = colorHEX;
    this.iconRotation = 0;
    this.appliedClasses = appliedClasses;
    this.framerate = framerate;
    this.deactivated = false;

    this.speedX = 0;
    this.speedY = 0;
    this.lookDir = 45;
    this.currSpeed = 0;
    this.maxSpeed = 300;
    this.accelerationPerSec = 950;
    this.targetDir = 0;
    this.origSlowdownPerSec = 0.95;
    this.slowdownPerSec = this.origSlowdownPerSec;

    this.lastUpdateMs = Date.now();
    this.randSteer = 0;
    this.randSteerChangePerSec = 60;
    this.randSteerMax = 84;

    this.domElement = createElement(
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
      this.domElement
    );
    this.icon = icon;
    this.initialized = false;
    this.domElement.PMObject = this;

    setInterval(() => {
      const PMObject = this;
      if (!PMObject.initialized) {
        PMObject.init();
        PMObject.initialized = true;
      } else {
        PMObject.update();
      }
    }, 1000 / this.framerate);
  }

  init() {
    //  TO-DO add pacman cherry in top right, which on hover spawns pacman through a zoom in fade animation
    const style = this.domElement.style;

    this.speedX = 0;
    this.speedY = 0;
    style.color = this.colorHEX;
    style.position = "absolute";
    style.transform = "translate(-50%, -50%)";

    this.moveTo(
      ~~(window.innerWidth / 2),
      ~~(window.scrollY + window.innerHeight / 2)
    );

    this.lastUpdateMs = Date.now();
    //console.log("initializing Pacman");

    this.domElement.addEventListener("click", () => {
      this.clicked();
    });
  }
  update() {
    const now = Date.now();
    if (this.deactivated) {
      this.domElement.classList.add("hidden");
    } else {
      const timeDeltaSec = (now - this.lastUpdateMs) / 1000;

      //console.log(
      //   "updating Pacman",
      //   this.element.style.top,
      //   this.element.style.left
      // );

      this.setTargetDir(timeDeltaSec);
      this.applyAcceleration(timeDeltaSec);
      this.updatePos(timeDeltaSec);
    }
    this.lastUpdateMs = now;
  }

  clicked() {
    // this.accelerationPerSec = 0;
    this.slowdownPerSec = 0.3;
    // Add hit class
    this.domElement.classList.add("hit");
    setTimeout(() => (this.deactivated = true), 1000);
  }

  repair() {
    this.slowdownPerSec = 0.1;
    this.domElement.classList.remove("hidden");
    this.domElement.classList.remove("hit");
    this.deactivated = false;
    this.speedX = 0;
    this.speedY = 0;
    setTimeout(this.moveTo(50, 50), 500);

    setTimeout((this.slowdownPerSec = this.origSlowdownPerSec), 1000);
  }

  setTargetDir(timeDeltaSec) {
    this.targetDir = this.angleCWFromUp(this.getPos(), this.getMousePos());

    let dirChange =
      this.randSteer +
      this.randSteerChangePerSec *
        timeDeltaSec *
        1000 *
        2 *
        (Math.random() - 0.5);
    if (dirChange > this.randSteerMax) dirChange = this.randSteerMax;
    if (dirChange < -this.randSteerMax) dirChange = -this.randSteerMax;

    this.targetDir += dirChange;
    //console.log(" - updating targetDir", this.targetDir);
  }

  // inside class, set e.g. this.slowdownPerSec = 0.9; // keep 90% velocity each second
  applyAcceleration(timeDeltaSec) {
    const accelSpeed = this.accelerationPerSec * timeDeltaSec;
    const rad = (this.targetDir * Math.PI) / 180;
    const pushX = accelSpeed * Math.sin(rad);
    const pushY = -accelSpeed * Math.cos(rad);
    this.speedX += pushX;
    this.speedY += pushY;

    // frame-rate-independent damping
    const perFrameDamping = Math.pow(this.slowdownPerSec, timeDeltaSec);
    this.speedX *= perFrameDamping;
    this.speedY *= perFrameDamping;

    // clamp hard to maxSpeed
    const speed = Math.hypot(this.speedX, this.speedY);
    if (speed > this.maxSpeed) {
      const k = this.maxSpeed / speed;
      this.speedX *= k;
      this.speedY *= k;
    }
  }

  updatePos(timeDeltaSec) {
    const deltaX = this.speedX * timeDeltaSec;
    const deltaY = this.speedY * timeDeltaSec;
    const oldPos = this.getPos();
    this.move(deltaX, deltaY);
    //console.log(" - Pos change: ", deltaX, deltaY);
    this.updateFacingDirection(oldPos, this.getPos());
  }

  getMousePos() {
    return [globData.mousePos.x, globData.mousePos.y];
  }

  getPos() {
    const rect = this.domElement.getBoundingClientRect();
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
    //console.log(fromPos, targetPos);

    const dx = targetPos[0] - fromPos[0];
    const dy = -(targetPos[1] - fromPos[1]);
    // atan2 returns angle from +x axis CCW; we need from +y axis CW
    // step1: get angle from +x axis CCW
    let theta = Math.atan2(dy, dx); // radians, range (-PI, PI]
    // step2: convert to angle from +y axis CW:
    // angleCW = (90deg - theta_in_deg) mod 360
    let deg = (90 - (theta * 180) / Math.PI) % 360;
    //console.log("[angle]: ", dx, dy, deg, "deg");

    if (deg < 0) deg += 360;
    return deg;
  }

  move(deltaX, deltaY) {
    const currPos = this.getPos();
    this.moveTo(currPos[0] + deltaX, currPos[1] + deltaY);
  }

  moveTo(newX, newY) {
    const style = this.domElement.style;
    style.top = newY + "px";
    style.left = newX + "px";
  }
}

export function createPacMan() {
  const PM1 = new Pacman("Orange Lighter", "#f3b918ff", ["contrast"], 60);
  const PM2 = new Pacman("Blue Shaker", "#18ecf3ff", ["shake"], 60);
  const PM3 = new Pacman("Red Rotator", "#f3189fff", ["rot1"], 60);
  const PM4 = new Pacman("Black Darkness", "#000000ff", ["dark"], 60);

  setTimeout(() => handleCollisions([PM1, PM2, PM3, PM4]), 1000);
}

function handleCollisions(PacMen) {
  // Select all elements under body except div and section
  const allSimpleElements = Array.from(
    document.querySelectorAll(
      ":not(.flex):not(.chapter):not(header):not(main):not(.pacman-icon):not(i):not(.pacman)"
    )
  );
  const allTextElements = Array.from(document.querySelectorAll(".text"));
  allSimpleElements.concat(allTextElements);

  // Poll for collisions every 10ms
  const interval = setInterval(() => {
    for (const PM of PacMen) {
      // Ensure style.top/left are applied (convert to numbers if needed)
      // If you position via transform instead, prefer getBoundingClientRect alone.
      const pmRect = PM.domElement.getBoundingClientRect();

      for (const el of allSimpleElements) {
        // Skip if element is the pacman's own node (or contains it)
        if (el === PM.domElement || el.contains(PM.domElement)) continue;

        const elRect = el.getBoundingClientRect();

        if (rectsOverlap(pmRect, elRect)) {
          onCollision(PM, el);
        }
      }
    }
  }, 10);

  // Optional: return a function to stop checking
  // return () => clearInterval(interval);
}

function rectsOverlap(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function onCollision(pacman, element) {
  // Default handler — replace with your own behavior
  // Example: log once per collision by toggling a data attribute
  // const key = `data-collided-with-${pacman.id || pacman.name || Math.random()}`;

  // element.setAttribute(key, "1");
  // Example action:
  const appliedClass = pacman.appliedClasses[0];
  if (!pacman.deactivated) {
    element.classList.add(appliedClass);
  }
  setTimeout(() => {
    element.classList.remove(appliedClass);
  }, 1500);
}
