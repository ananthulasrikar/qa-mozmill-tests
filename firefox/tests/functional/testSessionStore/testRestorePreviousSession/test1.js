/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var tabs = require("../../../../lib/tabs");

const BASE_URL = collector.addHttpResource("../../../../../data/");
const TEST_DATA = [
  BASE_URL + "layout/mozilla.html",
  BASE_URL + "layout/mozilla_projects.html",
  BASE_URL + "layout/mozilla_organizations.html",
];

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.tabBrowser = new tabs.tabBrowser(aModule.controller);
  aModule.tabBrowser.closeAllTabs();
}

function teardownModule(aModule) {
  aModule.controller.stopApplication();
}

/**
 * Open three webpages in different tabs
 */
function testOpenTabs() {
  controller.open(TEST_DATA[0])
  controller.waitForPageLoad();
  // Open 2 new tabs
  openTabWithUrl(TEST_DATA[1]);
  openTabWithUrl(TEST_DATA[2]);

  // Check for correct number of opened tabs
  assert.equal(tabBrowser.length, TEST_DATA.length,
               "There are " + TEST_DATA.length + " opened tabs");
}

/**
 * Open a new tab and navigate to a specific page
 *
 * @param {string} aURL
 *        Url of the page to navigate to
 */
function openTabWithUrl(aURL) {
  tabBrowser.openTab();
  tabBrowser.controller.open(aURL);
  tabBrowser.controller.waitForPageLoad();
}
