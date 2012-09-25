/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var addons = require("../../../../lib/addons");
var {assert} = require("../../../../lib/assertions");
var tabs = require("../../../../lib/tabs");

const TIMEOUT_USERSHUTDOWN = 2000;

function setupModule() {
  controller = mozmill.getBrowserController();
  addonsManager = new addons.AddonsManager(controller);

  tabs.closeAllTabs(controller);
}

/**
* Test enable the extension
*/
function testEnableExtension() {
  addonsManager.open();

  // Get the addon by name
  var addon = addonsManager.getAddons({attribute: "value",
                                       value: persisted.addon.id})[0];

  // Check if the addon is disabled
  assert.ok(!addonsManager.isAddonEnabled({addon: addon}),
            "The addon is disabled");

  // Enable the addon
  addonsManager.enableAddon({addon: addon});

  // Click on the list view restart link
  var restartLink = addonsManager.getElement({type: "listView_restartLink",
                                              parent: addon});

  // User initiated restart
  controller.startUserShutdown(TIMEOUT_USERSHUTDOWN, true);

  controller.click(restartLink);
}

// Bug 688375 - Test failure "Add-on not specified" in testAddons_enableDisableExtension
setupModule.__force_skip__ = "Bug 688375 - Test failure 'Add-on not " +
                             "specified' in testAddons_enableDisableExtension";