"use strict";

import { loadJSON } from "./ajax.js";
import { createElement } from "./dom_utils.js";
import { scrollSectionWrapper } from "./scrollSections.js";

export function init() {
  console.log("Starting the init");

  loadJSON("./../assets/data.json", createChapters);

  function createChapters(data) {
    for (let [dataName, dataValue] of Object.entries(data.data)) {
      console.log("DataName", dataName);
      dataName = dataName.split("Data")[0];
      const dataTitle = dataName.split(" ").join("").toLowerCase() + "_Title";

      const elDataDisplay = createElement("section", ["text"]);
      const elDataTitle = createElement(
        "h2",
        ["chapterTitle"],
        "My " + dataName + ":",
        elDataDisplay,
        dataTitle
      );

      const elDataParagraph = createElement(
        "p",
        ["chapterDescr", "text"],
        dataValue.chapterDescr,
        elDataDisplay
      );

      const elElements = generateChapContent(dataValue.type, dataValue.entries);
      elDataDisplay.append(elElements);

      scrollSectionWrapper(dataName, elDataDisplay);
    }
  }
}

function generateChapContent(contentType, elementsObject) {
  console.log("contentType", contentType);
  console.log("elementsObject", elementsObject, typeof elementsObject);

  if (contentType == "value-bars") {
    return generateValueBars(elementsObject);
  } else if (contentType == "badges") {
    return generateBadges(elementsObject);
  } else if (contentType == "slider-grid") {
    return generateSliderGrid(elementsObject);
  } else if (contentType == "logo-markdown-flex") {
    return generateLogoMarkdownFlex(elementsObject);
  }

  // for (let element of elementsObject) {
  //   console.log("element", element);
  // }
}

function generateValueBars(elementsObject) {
  // for (let element of elementsObject) {
  //   console.log("element", element);
  // }
}
function generateBadges(elementsObject) {
  const elBadgeDiv = createElement("div", ["flex", "flex-wrap"]);
  for (let element of elementsObject) {
    console.log("element", element);
    const elBadge = createElement(
      "span",
      ["badge", "text"],
      element.name,
      elBadgeDiv
    );
    elBadge.style.backgroundColor = "#a0a";
  }
  return elBadgeDiv;
}
function generateSliderGrid(elementsObject) {
  // for (let element of elementsObject) {
  //   console.log("element", element);
  // }
}
function generateLogoMarkdownFlex(elementsObject) {
  // for (let element of elementsObject) {
  //   console.log("element", element);
  // }
}
