/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var addons = require("../../../lib/addons");
var { assert } = require("../../../../lib/assertions");
var modalDialog = require("../../../lib/modal-dialog");
var prefs = require("../../../lib/prefs");
var tabs = require("../../../lib/tabs");
var toolbars = require("../../../lib/toolbars");

const PREF_INSTALL_DIALOG = "security.dialog_enable_delay";
const PREF_LAST_CATEGORY = "extensions.ui.lastCategory";
const PREF_XPI_WHITELIST = "xpinstall.whitelist.add";

const INSTALL_DIALOG_DELAY = 250;
const TIMEOUT_DOWNLOAD = 25000;

const ADDON = {
  name: "Restartless Addon with EULA",
  url: "https://addons.mozilla.org/en-US/firefox/addon/restartless-addon-with-eula/"
};

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.locationBar = new toolbars.locationBar(aModule.controller);
  aModule.tabBrowser = new tabs.tabBrowser(aModule.controller);

  aModule.addonsManager = new addons.AddonsManager(aModule.controller);
  aModule.addons.setDiscoveryPaneURL("about:home");

  prefs.preferences.setPref(PREF_INSTALL_DIALOG, INSTALL_DIALOG_DELAY);

  tabs.closeAllTabs(aModule.controller);
}

function teardownModule(aModule) {
  prefs.preferences.clearUserPref(PREF_INSTALL_DIALOG);
  prefs.preferences.clearUserPref(PREF_LAST_CATEGORY);
  // Bug 951138
  // Mozprofile doesn't clear this pref while it is clearing all permissions
  prefs.preferences.clearUserPref(PREF_XPI_WHITELIST);

  aModule.addons.resetDiscoveryPaneURL();
  aModule.addonsManager.close();
}

/**
 * Installs an Addon with EULA from AMO
 */
function testInstallAddonWithEULA() {
  controller.open(ADDON.url);
  controller.waitForPageLoad();

  // Add elements to UI map for add-ons with EULA
  var addonPage = new addons.AMOAddonPage(controller);
  var continueToDownloadLink = addonPage.getElement({type: "install-button"});

  // Click on continue to download link
  controller.click(continueToDownloadLink);
  controller.waitForPageLoad();

  var addButton = addonPage.getElement({type: "install-button"});
  var md = new modalDialog.modalDialog(controller.window);

  // Install the add-on
  md.start(addons.handleInstallAddonDialog);
  controller.click(addButton);
  md.waitForDialog(TIMEOUT_DOWNLOAD);

  // Handle the notification popup
  locationBar.waitForNotification("notification_popup", true);
  controller.keypress(null , 'VK_ESCAPE', {});
  locationBar.waitForNotification("notification_popup", false);

  // Open the Add-ons Manager
  addonsManager.open();
  addonsManager.setCategory({
    category: addonsManager.getCategoryById({id: "extension"})
  });

  // Verify the add-on is installed
  var addon = addonsManager.getAddons({attribute: "name", value: ADDON.name})[0];
  assert.ok(addonsManager.isAddonInstalled({addon: addon}),
            "The add-on has been correctly installed");
}