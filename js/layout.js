"use strict";

import { loadJSON } from "./ajax.js";
import { createElement } from "./dom_utils.js";
import { shuffle, COLORS } from "./design.js";
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
  console.log(" - generateValueBars");
  const elGraphDiv = createElement("div", ["flex", "flex-wrap"], "");
  const elGraphCount = createElement(
    "div",
    ["flex", "flex-dir-up"],
    "",
    elGraphDiv
  );
  const elGraphBorder = createElement(
    "div",
    ["flex", "flex-bottom-align"],
    "",
    elGraphDiv
  );
  elGraphCount.style.maxWidth = "10%";
  elGraphCount.style.minHeight = "300px";
  elGraphBorder.style.maxWidth = "90%";
  elGraphBorder.style.minHeight = "300px";

  elGraphBorder.style.borderBottom = "3px #333 solid";
  elGraphBorder.style.borderLeft = "3px #333 solid";
  elGraphCount.style.padding = "10px";
  elGraphCount.style.justifyContent = "space-between";
  elGraphBorder.style.padding = "10px";

  let maxVal = 0;
  elementsObject.forEach((element) => {
    // console.log("element.name", element.name, element.value);
    maxVal = Math.max(maxVal, element.value);
  });

  for (let i = 0; i < 11; i++) {
    const labelVal = i * (maxVal / 10).toFixed();
    const elYNum = createElement(
      "span",
      ["yLabel", "text"],
      labelVal,
      elGraphCount
    );
  }

  const randCOLORS = shuffle(COLORS);
  for (let [ind, element] of Object.entries(elementsObject)) {
    // console.log("element", element);
    const elColumn = createElement(
      "div",
      ["column", "text", "whiteText"],
      "",
      elGraphBorder
    );

    elColumn.style.height = (100 * element.value) / maxVal + "%";
    const colLabel = element.name + ":  " + element.value.toFixed();
    const elColLabel = createElement(
      "div",
      ["text", "rot90CW"],
      colLabel,
      elColumn
    );
    const elColDesc = createElement(
      "span",
      ["column-proj"],
      element.proj,
      elColLabel
    );
    elColumn.style.backgroundColor = randCOLORS[ind];
  }
  return elGraphDiv;
}
function generateBadges(elementsObject) {
  const elBadgeDiv = createElement("div", ["flex", "flex-wrap"]);
  const randCOLORS = shuffle(COLORS);
  console.log(" - generateBadges");
  for (let [ind, element] of Object.entries(elementsObject)) {
    // console.log("Badge element", element);
    const elBadge = createElement(
      "span",
      ["badge", "text", "whiteText"],
      element.name,
      elBadgeDiv
    );
    elBadge.style.backgroundColor = randCOLORS[ind];
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
