/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var prefs = require("../../../../lib/prefs");

const BROWSER_HOME_PAGE = 'browser.startup.homepage';
const BROWSER_STARTUP_PAGE = 'browser.startup.page';
const PROXY_TYPE = 'network.proxy.type';

/**
 * Sets browser start up page, home page, and proxy settings
 */
var setupModule = function() {
  controller = mozmill.getBrowserController();

  // Set browser home page to about:blank
  prefs.preferences.setPref(BROWSER_HOME_PAGE, "about:blank");

  // Set browser start up to display current home page
  prefs.preferences.setPref(BROWSER_STARTUP_PAGE, 1);

  // Set the proxy type in connection settings to 'Auto-detect proxy settings ...'
  prefs.preferences.setPref(PROXY_TYPE, 4);
}

function teardownModule() {
  // Bug 867217
  // Mozmill 1.5 does not have the restartApplication method on the controller.
  // Remove condition when transitioned to 2.0
  if ("restartApplication" in controller) {
    controller.restartApplication();
  }
}

setupModule.__force_skip__ = "Bug 827276 - Test failure 'Check for updates has been completed' in proxy environment";
teardownModule.__force_skip__ = "Bug 827276 - Test failure 'Check for updates has been completed' in proxy environment";
