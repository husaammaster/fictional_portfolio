"use strict";

import { createElement } from "./dom_utils.js";

const elHeader = createElement("header", ["header"], "", document.body);
export const elMain = createElement("main", ["main"], "", document.body);

const elTitle = createElement(
  "h2",
  ["title", "float-right"],
  "husaammaster",
  elHeader
);
const elNavbar = createElement("nav", ["navbar", "buttons"], "", elHeader);

export function scrollSectionWrapper(
  chapterName,
  chapterElement,
  chapterParent
) {
  const chapterID = chapterName.split(" ").join("").toLowerCase() + "_Chapter";

  const elNavButton = createElement(
    "button",
    ["navButton", "float-left"],
    chapterName,
    elNavbar,
    chapterName.split(" ").join("").toLowerCase() + "_Nav"
  );

  const elNavChapter = createElement("div", ["chapter"], "", elMain, chapterID);
  elNavChapter.append(chapterElement);

  elNavButton.addEventListener("click", (evnt) => {
    const chapterName = evnt.currentTarget.id;
    console.log("clicked Nav element of chapterName: " + chapterName);
    scrollTo(chapterID);
  });

  if (chapterParent) chapterParent.append(elNavChapter);
  else elMain.append(elNavChapter);
}

function scrollTo(targetID) {
  const headerOffset = 45;
  const scrollTarget = document.querySelector("#" + targetID);
  console.log(scrollTarget);
  scrollTarget.scrollIntoView({
    behavior: "smooth",
  });
}
