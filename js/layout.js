"use strict";

import { loadJSON } from "./ajax.js";
import { createElement } from "./dom_utils.js";
import { scrollSectionWrapper } from "./scrollSections.js";

export function init() {
  console.log("Starting the init");

  loadJSON("./../assets/data.json", createChapters);

  function createChapters(data) {
    for (let [dataName, dataEntries] of Object.entries(data.data)) {
      console.log(dataName, dataEntries[0]);

      const dataTitle = dataName.split("Data")[0];
      const elDataDisplay = createElement(
        "h2",
        ["chapterTitle"],
        "Chapter: " + dataTitle + "<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-",
        null,
        dataTitle
      );
      scrollSectionWrapper(dataTitle.toUpperCase(), elDataDisplay);
    }
  }
}
