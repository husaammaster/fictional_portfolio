"use strict";

import { createElement } from "./dom_utils.js";

const elHeader = createElement("header", ["header"], "", document.body);
const elMain = createElement("main", ["main"], "", document.body);

const elTitle = createElement(
  "h2",
  ["title", "float-left"],
  "husaammaster",
  elHeader
);
const elNavbar = createElement("nav", ["navbar", "buttons"], "", elHeader);

export function scrollSectionWrapper(chapterName, chapterElement) {
  const elNavButton = createElement(
    "span",
    ["navButton", "float-left"],
    chapterName,
    elHeader,
    chapterName.split(" ").join("") + "_Nav"
  );

  const elNavChapter = createElement(
    "div",
    ["chapter"],
    "",
    elMain,
    chapterName.split(" ").join("") + "_Chapter"
  );

  elNavButton.addEventListener("click", (evnt) => {
    const chapterName = evnt.currentTarget.targetID;
    console.log("clicked Nav element of chapterName: " + chapterName);
  });
}

function scrollTo(targetID) {}
