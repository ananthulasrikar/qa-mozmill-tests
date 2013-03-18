/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Cu.import("resource://gre/modules/Services.jsm");

// Include the required modules
var { assert } = require("../../../lib/assertions");
var places = require("../../../lib/places");
var privateBrowsing = require("../../../lib/ui/private-browsing");
var tabs = require("../../../lib/tabs");

const TEST_URL = "http://mozqa.com/data/firefox/plugins/flash/cookies/" +
                 "flash_cookie.html";

const COOKIE_VALUE = "cookieValue";

var version = Services.sysinfo.getProperty("version");
if (mozmill.isMac && version.contains("10.8")) {
  setupModule.__force_skip__ = "Bug 838134 - Flash is disabled on MAC OS X 10.6.8 machines";
  teardownModule.__force_skip__ = "Bug 838134 - Flash is disabled on MAC OS X 10.6.8 machines";
}

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.pbWindow = new privateBrowsing.PrivateBrowsingWindow();

  places.clearPluginData();
  tabs.closeAllTabs(aModule.controller);
}

function teardownModule(aModule) {
  aModule.pbWindow.close();
  places.clearPluginData();
}

/**
 * Verify that the Flash cookie is not visible
 * if it was saved in Private Brosing mode
 */
function testCheckFlashCookie() {
  pbWindow.open(controller);

  pbWindow.controller.open(TEST_URL);
  pbWindow.controller.waitForPageLoad();

  // Enter an unique value for the cookie
  var cookieField = new elementslib.ID(pbWindow.controller.tabs.activeTab, "cookieValue");
  pbWindow.controller.type(cookieField, COOKIE_VALUE);

  // Set the cookie value
  var setCookie = new elementslib.ID(pbWindow.controller.tabs.activeTab, "setCookie");
  controller.click(setCookie);

  // Verify the cookie value was set properly
  var resultFieldPB = new elementslib.ID(pbWindow.controller.tabs.activeTab, "result_get");
  assert.equal(resultFieldPB.getNode().value, COOKIE_VALUE,
               "Cookie value is displayed in private mode");

  // Open page in normal mode
  controller.open(TEST_URL);
  controller.waitForPageLoad();

  // Get the cookie value
  var getCookie = new elementslib.ID(controller.tabs.activeTab, "getCookie");
  controller.click(getCookie);

  // Verify the cookie value is undefined
  var resultField = new elementslib.ID(controller.tabs.activeTab, "result_get");
  assert.notEqual(resultField.getNode().value, COOKIE_VALUE,
                  "Cookie value is not displayed in normal mode");

  // Reset the cookie value
  var clearCookie = new elementslib.ID(pbWindow.controller.tabs.activeTab, "clearCookie");
  pbWindow.controller.click(clearCookie);
  assert.equal(resultFieldPB.getNode().value, "undefined", "Flash cookie was cleared");
}