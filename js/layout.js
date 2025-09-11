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

      scrollSectionWrapper(dataName, elDataDisplay);
    }
  }
}

function generateChapContent(contentType, elementsObject) {
  console.log("contentType", contentType);
  console.log("elementsObject", elementsObject, typeof elementsObject);

  if (contentType == "value-bars") {
    generateValueBars(elementsObject);
  } else if (contentType == "badges") {
    generateBadges(elementsObject);
  } else if (contentType == "slider-grid") {
    generateSliderGrid(elementsObject);
  } else if (contentType == "logo-markdown-flex") {
    generateLogoMarkdownFlex(elementsObject);
  }

  // for (let element of elementsObject) {
  //   console.log("element", element);
  // }
}

function generateValueBars(elementsObject) {}
function generateBadges(elementsObject) {}
function generateSliderGrid(elementsObject) {}
function generateLogoMarkdownFlex(elementsObject) {}
