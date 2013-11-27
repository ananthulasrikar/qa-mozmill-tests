/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include necessary modules
var { assert } = require("../../../lib/assertions");
var utils = require("../../../lib/utils");

const TEST_PAGE = "https://ssl-selfsigned.mozqa.com";

var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();
}

/**
 * Test the Get Me Out Of Here button from an Untrusted Error page
 */
var testUntrustedPageGetMeOutOfHereButton = function() {
  // Go to an untrusted website
  controller.open(TEST_PAGE);
  controller.waitForPageLoad();

  // Get a reference to the Get Me Out Of Here button
  var getMeOutOfHereButton = new elementslib.ID(controller.tabs.activeTab,
                                                "getMeOutOfHereButton");
  assert.ok(getMeOutOfHereButton.exists(), "'Get me out of here' button has been found");

  // Click the button
  controller.click(getMeOutOfHereButton);

  // Wait for the redirected page to load
  controller.waitForPageLoad();

  // Verify the loaded page is the homepage
  utils.assertLoadedUrlEqual(controller, utils.getDefaultHomepage());
}