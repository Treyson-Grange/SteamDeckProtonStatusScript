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

  /**
   * Rating Removal System
   */
  const elementsToRemove = [".ratingRow", ".ratingBlock"];
  const STORAGE_KEY = "remove";

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

  const toggleElements = () => {
    const shouldRemove = localStorage.getItem(STORAGE_KEY) === "true";

    if (shouldRemove) {
      showElements();
      localStorage.setItem(STORAGE_KEY, "false");
    } else {
      removeElements();
      localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  const addToggleButton = () => {
    const toggleButton = document.createElement("button");
    toggleButton.innerText = "Toggle Remove Elements";
    toggleButton.style.margin = "0 1rem";
    toggleButton.classList.add("albumButton");
    toggleButton.addEventListener("click", toggleElements);

    document.querySelector(".sectionHeading").prepend(toggleButton);
  };

  /**
   * Settings System
   */
  const onSettings = () => {
    const page = window.location.pathname;
    console.log(page);
    return page === "/account/edit.php";
  };

  const settingsInit = () => {
    if (onSettings) {
      settingHeader();
      setting("test", "test", "test");
    } else {
      return;
    }
  };

  const settingHeader = () => {
    const sectionHeader = document.createElement("div");
    const namedForm = document.querySelector('form[name="form"]');
    const lineBreak = document.createElement("br");

    if (namedForm) {
      sectionHeader.classList.add("sectionHeading");
      sectionHeader.innerText = "AOTY Script Options";
      namedForm.insertAdjacentElement("afterend", sectionHeader);
      namedForm.insertAdjacentElement("afterend", lineBreak);
    }
  };

  const setting = (text, localStorageItem, newDecision) => {
    const sectionDiv = document.querySelector(".section");
    if (sectionDiv) {
      const toggleButton = document.createElement("button");
      toggleButton.innerText = text;
      toggleButton.classList.add("albumButton");
      toggleButton.addEventListener("click", () => {
        localStorage.setItem(localStorageItem, newDecision);
      });
      sectionDiv.appendChild(toggleButton);
    } else {
      console.log("error");
    }
  };

  const init = () => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      removeElements();
    } else {
      showElements();
    }
  };

  const main = () => {
    init();
    addToggleButton();
    settingsInit();
  };

  main();
})();

/**
 * OK Ideas here.
 * Get rid of ratings ON the settings page. add more options.
 */
