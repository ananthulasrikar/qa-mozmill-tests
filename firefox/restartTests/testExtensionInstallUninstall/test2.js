/* ****** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MozMill Test code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Henrik Skupin <hskupin@mozilla.com>
 *   Aakash Desai <adesai@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// Include necessary modules
var RELATIVE_ROOT = '../../../shared-modules';
var MODULE_REQUIRES = ['AddonsAPI', 'ModalDialogAPI', 'UtilsAPI'];

const gTimeout = 5000;

var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();
  module.addonsManager = new AddonsAPI.addonsManager();
}

var testCheckInstalledExtension = function() 
{
  // Check if Add-ons Manager is opened after restart
  var window = mozmill.wm.getMostRecentWindow('Extension:Manager');
  if (!window)
    throw new Error("Addons Manager has not been opened automatically after the restart");

  addonsManager.open();

  // Extensions pane should be selected
  addonsManager.controller.waitForEval("subject.getPane() == 'extensions'", 10000, 100, addonsManager);

  // Notification bar should show one new installed extension
  var notificationBar = new elementslib.Lookup(addonsManager.controller.window.document, '/id("extensionsManager")/id("addonsMsg")/{"type":"warning"}/anon({"type":"warning"})/anon({"anonid":"details"})/anon({"anonid":"messageText"})');
  addonsManager.controller.waitForElement(notificationBar, gTimeout);

  // The installed extension should be displayed with a different background in the list.
  // We can find it by the attribute "newAddon"
  // XXX: Use a hard-coded name to access the entry directly until we can pass the info
  // between restart test files (bug 500987)
  var extension = new elementslib.Lookup(addonsManager.controller.window.document,
                                         addonsManager.getListItem("addonID", persisted.extensionId));
  addonsManager.controller.waitForElement(extension, gTimeout);
  addonsManager.controller.assertJS("subject.getAttribute('newAddon') == 'true'",
                                    extension.getNode());
}

/*
 * Tests the uninstallation of the extension
 */
var testUninstallExtension = function() 
{
  // Confirm the installed extension and click on it
  var extension = new elementslib.Lookup(addonsManager.controller.window.document,
                                         addonsManager.getListItem("addonID", persisted.extensionId));
  addonsManager.controller.waitThenClick(extension, gTimeout);

  // Create a modal dialog instance to handle the software uninstallation dialog
  var md = new ModalDialogAPI.modalDialog(handleTriggerDialog);
  md.start();

  var uninstallExtensionButton = new elementslib.Lookup(addonsManager.controller.window.document,
                                                        addonsManager.getListItem("addonID", persisted.extensionId) +
                                                        '/anon({"flex":"1"})/{"class":"addonTextBox"}' +
                                                        '/anon({"anonid":"selectedButtons"})/{"command":"cmd_uninstall"}');
  addonsManager.controller.waitThenClick(uninstallExtensionButton);
 
  // Wait for the restart button
  var restartButton = new elementslib.XPath(addonsManager.controller.window.document, "/*[name()='window']/*[name()='notificationbox'][1]/*[name()='notification'][1]");
  addonsManager.controller.waitForElement(restartButton, gTimeout);
}

/**
 * Handle the Software Un-installation dialog
 */
var handleTriggerDialog = function(controller) 
{
  var cancelButton = new elementslib.Lookup(controller.window.document, '/id("addonList")/anon({"anonid":"buttons"})/{"dlgtype":"cancel"}');
  var uninstallButton = new elementslib.Lookup(controller.window.document, '/id("addonList")/anon({"anonid":"buttons"})/{"dlgtype":"accept"}');

  controller.waitForElement(cancelButton, gTimeout);

  controller.waitForEval("subject.disabled != true", 7000, 100, uninstallButton.getNode());
  controller.waitThenClick(uninstallButton, gTimeout);
}

/**
 * Map test functions to litmus tests
 */
testCheckInstalledExtension.meta = {litmusids : [7972]};
testUninstallExtension.meta = {litmusids : [8164]};
