// ==UserScript==
// @name         Album Of The Year, My Way.
// @namespace    http://tampermonkey.net/
// @version      2024-09-17
// @description  AOTY script that toggles and remembers removal of specified elements
// @author       You
// @match        https://www.albumoftheyear.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const elementsToRemove = [
    ".ratingRow",
    ".ratingBlock",
    ".albumListScoreContainer",
    ".rating",
    ".ratingBar",
  ];
  const HIDE_SCORES_LS = "remove";

  //
  let referenceElement;

  const removeElements = () => {
    elementsToRemove.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => (element.style.display = "none"));
    });
  };

  const showElements = () => {
    elementsToRemove.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => (element.style.display = ""));
    });
  };

  const toggleElements = (shouldRemove) => {
    if (shouldRemove) {
      removeElements();
    } else {
      showElements();
    }
    localStorage.setItem(HIDE_SCORES_LS, shouldRemove ? "true" : "false");
    updateStatusLabel();
  };

  const onSettings = () => {
    const page = window.location.pathname;
    return page === "/account/edit.php";
  };

  const settingsInit = () => {
    if (onSettings()) {
      settingHeader();
      settingText("Hide Scores on AOTY, fight Bias!");
      settingRadioInput("Show Scores", "Hide Scores", HIDE_SCORES_LS);
    }
  };

  const getOrCreateReferenceElement = () => {
    if (!referenceElement) {
      const namedForm = document.querySelector('form[name="form"]');

      if (namedForm) {
        referenceElement = document.createElement("div");
        referenceElement.id = "aotyScriptReference";
        namedForm.insertAdjacentElement("afterend", referenceElement);
      }
    }
    return referenceElement;
  };

  const settingHeader = () => {
    const sectionHeader = document.createElement("div");
    sectionHeader.style.marginTop = "1rem";
    sectionHeader.classList.add("sectionHeading");
    sectionHeader.innerText = "AOTY Script Options";

    const reference = getOrCreateReferenceElement();
    reference.insertAdjacentElement("beforebegin", sectionHeader);
  };

  const settingText = (text) => {
    const p = document.createElement("p");
    p.innerText = text;
    p.style.marginBottom = "10px";

    const reference = getOrCreateReferenceElement();
    reference.insertAdjacentElement("beforebegin", p);
  };

  const settingRadioInput = (labelShow, labelHide, localStorageItem) => {
    const form = document.createElement("div");

    const statusLabel = document.createElement("div");
    statusLabel.id = "statusLabel";
    statusLabel.style.marginBottom = "10px";
    form.appendChild(statusLabel);

    const radioShow = createRadioOption("show", labelShow, localStorageItem);
    const radioHide = createRadioOption("hide", labelHide, localStorageItem);

    const radioContainer = document.createElement("div");
    radioContainer.style.display = "inline-flex";
    radioContainer.style.gap = "20px";

    radioContainer.appendChild(radioShow.container);
    radioContainer.appendChild(radioHide.container);

    form.appendChild(radioContainer);

    const reference = getOrCreateReferenceElement();
    reference.insertAdjacentElement("beforebegin", form);
  };

  const createRadioOption = (value, labelText, localStorageItem) => {
    const isChecked =
      localStorage.getItem(localStorageItem) ===
      (value === "hide" ? "true" : "false");

    const container = document.createElement("div");
    container.style.display = "inline-flex";
    container.style.alignItems = "center";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "showHideScores";
    radio.value = value;
    radio.checked = isChecked;

    radio.addEventListener("change", () => {
      toggleElements(value === "hide");
    });

    const label = document.createElement("label");
    label.innerText = labelText;
    label.style.marginLeft = "5px";

    container.appendChild(radio);
    container.appendChild(label);

    return { container };
  };

  const init = () => {
    const shouldRemove = localStorage.getItem(HIDE_SCORES_LS) === "true";
    if (shouldRemove) {
      removeElements();
    } else {
      showElements();
    }
  };

  const main = () => {
    init();
    settingsInit();
  };

  main();
})();
