"use strict";

import { loadJSON } from "./ajax.js";
import { createElement } from "./dom_utils.js";
import { getRndInteger, shuffle, COLORS } from "./design.js";
import { scrollSectionWrapper } from "./scrollSections.js";
import globData from "./globData.js";

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

  document.body.addEventListener("mousemove", (evnt) => {
    globData.mousePos.x = evnt.pageX;
    globData.mousePos.y = evnt.pageY;
  });
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
  const elGraphDiv = createElement("div", ["flex", "flex-start"], "");
  const elGraphCount = createElement(
    "div",
    ["flex", "flex-dir-up", "flex-space-between"],
    "",
    elGraphDiv
  );
  const elGraphBorder = createElement(
    "div",
    ["flex", "flex-bottom-align", "scrollX"],
    "",
    elGraphDiv
  );

  elGraphDiv.style.padding = "30px";

  elGraphCount.style.maxWidth = "10%";
  elGraphCount.style.minHeight = "300px";
  // elGraphBorder.style.minWidth = 65 * elementsObject.length + "px";

  elGraphBorder.style.maxWidth = "90%";
  elGraphBorder.style.minHeight = "300px";

  elGraphBorder.style.borderBottom = "3px #333 solid";
  elGraphBorder.style.borderLeft = "3px #333 solid";
  elGraphCount.style.padding = "30px";
  elGraphCount.style.justifyContent = "space-between";
  elGraphBorder.style.padding = "10px";

  let maxVal = 0;
  elementsObject.forEach((element) => {
    // console.log("element.name", element.name, element.value);
    maxVal = Math.max(maxVal, element.value);
  });

  for (let i = 0; i < 10; i++) {
    const labelVal = i * (maxVal / 9).toFixed();
    const elYNum = createElement(
      "span",
      ["yLabel", "text"],
      labelVal,
      elGraphCount
    );
  }
  elGraphCount.style.margin = 0;
  elGraphCount.style.padding = 0;
  elGraphCount.style.paddingBottom = "22px";
  elGraphCount.style.paddingTop = "12px";

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
    elColumn.style.backgroundColor = randCOLORS[ind % randCOLORS.length];
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
    elBadge.style.backgroundColor = randCOLORS[ind % randCOLORS.length];
  }
  return elBadgeDiv;
}

function generateSliderGrid(elementsObject) {
  console.log("Generating slider Grid");

  const elSliderFlexGrid = createElement("div", [
    "felx",
    "flex-wrap",
    "flex-start",
  ]);
  for (let element of elementsObject) {
    const elSliderContainer = createElement(
      "div",
      ["slider-container"],
      "",
      elSliderFlexGrid
    );
    const elSliderTop = createElement(
      "div",
      ["slider-top"],
      "",
      elSliderContainer
    );

    const mediaArray = element.mediaURLs;

    elSliderContainer.currIndex = 0;
    elSliderContainer.mediaURLs = mediaArray;
    elSliderContainer.currURL = mediaArray[elSliderContainer.currIndex];
    elSliderContainer.addEventListener("click", (evnt) => {
      const elSliCont = evnt.currentTarget;
      const elSliTop = elSliCont.querySelector(".slider-top");
      elSliCont.currIndex =
        (elSliCont.currIndex + 1) % elSliCont.mediaURLs.length;
      const currURL = elSliCont.mediaURLs[elSliCont.currIndex];
      if (currURL) {
        elSliTop.innerHTML = "";
        elSliTop.append(renderMedia(currURL, ""));
      } else {
        elSliTop.innerHTML = "no media URLs found";
      }
    });

    const elSliderBottom = createElement(
      "div",
      ["slider-bottom"],
      "",
      elSliderContainer
    );
    const elSliderTitle = createElement(
      "h3",
      ["slider-title", "text"],
      element.name,
      elSliderContainer
    );
    const elDescr = createElement(
      "div",
      ["slider-descr", "text", "text-wrap"],
      element.shortDescr,
      elSliderContainer
    );
    if (element.githubLink) {
      const elSliderGithubL = createElement(
        "a",
        ["slider-descr", "text"],
        "GitHub Link",
        elSliderContainer
      );
      elSliderGithubL.href = element.githubLink;
    }

    elSliderContainer.click();
    // console.log("element", element);

    function recTimeout() {
      elSliderContainer.click();
      setTimeout(recTimeout, getRndInteger(15000, 19000));
    }
    recTimeout();
  }
  return elSliderFlexGrid;
}

function renderMedia(mediaURL = "", direction) {
  console.log("rendering the MediaURL: " + mediaURL);
  mediaURL += "";
  let result = "unrendered Media Url";
  if (mediaURL.includes("mp4")) {
    result = createElement("video", ["slider-video", "autoplay", "muted"]);
    result.src = mediaURL;
    result.autoplay = "autoplay";
    result.controls = "controls";
    result.muted = "muted";
  } else if (
    mediaURL.includes("png") ||
    mediaURL.includes("jpg") ||
    mediaURL.includes("jpeg")
  ) {
    result = createElement("img", ["slider-img"]);
    result.src = mediaURL;
  } else if (mediaURL.includes("github.com")) {
    // <a
    //   class="github"
    //   href="https://github.com/mx0c/super-mario-python"
    //   target="_blank"
    //   rel="noopener"
    // >
    //   <strong>mx0c/super-mario-python</strong>
    //   <img
    //     src="https://img.shields.io/github/stars/mx0c/super-mario-python?style=social"
    //     alt="stars"
    //   />
    //   <img
    //     src="https://img.shields.io/github/forks/mx0c/super-mario-python?style=social"
    //     alt="forks"
    //   />
    // </a>

    const numMediaURLComponents = mediaURL.split("/").length;
    const username = mediaURL.split("/")[numMediaURLComponents - 2];
    const repoName = mediaURL.split("/")[numMediaURLComponents - 1];
    const repoIdentifier = `${username}/${repoName}/`;
    console.log(" - Github username", username, "repoName", repoName);

    result = createElement("a", ["github", "text"]);
    result.href = mediaURL;
    result.target = "_blank";
    result.rel = "noopener";
    const elStrong = createElement("strong", ["text"], repoIdentifier, result);
    const elImgStars = createElement("img", [], "", result);
    elImgStars.src = `https://img.shields.io/github/stars/${username}/${repoName}?style=social`;
    elImgStars.alt = "stars";
    const elImgForks = createElement("img", [], "", result);
    elImgForks.src = `https://img.shields.io/github/forks/${username}/${repoName}?style=social`;
    elImgForks.alt = "forks";
  } else {
    result = 'Unknown MediaElement with mediaURL: "' + mediaURL + '"';
  }
  return result;
}

function generateLogoMarkdownFlex(elementsObject) {
  const elMarkDivContainer = createElement("div", ["markDivContainer"]);

  for (let [ind, element] of Object.entries(elementsObject)) {
    const elMarkTriplet = createElement(
      "div",
      ["markTriplet"],
      "",
      elMarkDivContainer
    );
    const markTitle =
      element.name +
      " at " +
      element.company +
      ` (${element.durationMonths} months)`;
    const elMarkTitle = createElement("h3", ["text"], markTitle, elMarkTriplet);
    elMarkTriplet.style.marginTop = "15px";
    const elMarkDiv = createElement(
      "div",
      ["markDiv", "flex", "flex-wrap"],
      "",
      elMarkTriplet
    );
    elMarkDiv.style.marginBottom = "20px";
    elMarkDiv.style.marginTop = "10px";
    const elLogoCont = createElement(
      "div",
      ["flex", "flex-center-center"],
      "",
      elMarkDiv
    );
    elLogoCont.style.width = "19%";
    const elLogo = createElement("img", ["logo"], "", elLogoCont);
    elLogo.src = element.logoImg;
    elLogo.alt = element.company + " Logo";

    const elMarkdown = createElement(
      "div",
      ["text", "markdown"],
      // element.descriptionMarkdown,
      marked.parse(element.descriptionMarkdown),
      elMarkDiv
    );
    elMarkdown.style.width = "75%";
    elMarkdown.style.padding = "10px";
  }
  return elMarkDivContainer;
}
