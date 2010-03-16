/* ***** BEGIN LICENSE BLOCK *****
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
 * The Original Code is Mozmill Test Code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Aakash Desai <adesai@mozilla.com>
 *   Henrik Skupin <hskupin@mozilla.com>
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
var RELATIVE_ROOT = '../../shared-modules';
var MODULE_REQUIRES = ['PrefsAPI', 'UtilsAPI'];

const gDelay = 0;
const gTimeout = 5000;

var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();
}

/**
 * Open and dismiss the preferences dialog
 */
var testOpenCloseOptionsDialog = function()
{
  // Reset pane to the main pane before starting the test
  PrefsAPI.preferencesDialog.open(prefPaneResetCallback);
}

/**
 * Panes of preferences dialog should retain state when opened next time
 */
var testOptionsDialogRetention = function() {
  // Choose the Privacy pane
  PrefsAPI.preferencesDialog.open(prefPaneSetCallback);

  // And check if the Privacy pane is still selected
  PrefsAPI.preferencesDialog.open(prefPaneCheckCallback);
}

/**
 * Reset the current pane to the main options
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var prefPaneResetCallback = function(controller) {
  PrefsAPI.preferencesDialog.setPane(controller, 'paneMain');
  controller.sleep(gDelay);

  // Close the Preferences dialog
  PrefsAPI.preferencesDialog.close(controller);
}

/**
 * Select the Advanced and the Privacy pane
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var prefPaneSetCallback = function(controller) {
  // Select the Advanced pane
  PrefsAPI.preferencesDialog.setPane(controller, 'paneAdvanced');
  controller.sleep(gDelay);

  // Select the Privacy pane
  PrefsAPI.preferencesDialog.setPane(controller, 'panePrivacy');
  controller.sleep(gDelay);

  // Close the Preferences dialog
  PrefsAPI.preferencesDialog.close(controller);
}

/**
 * The Privacy pane should still be selected
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var prefPaneCheckCallback = function(controller) {
  controller.assertJS("subject.getPane(controller) == 'panePrivacy'", 
                      PrefsAPI.preferencesDialog);
  controller.sleep(gDelay);

  // Close the Preferences dialog
  PrefsAPI.preferencesDialog.close(controller);
}

/**
 * Map test functions to litmus tests
 */
testOpenCloseOptionsDialog.meta = {litmusids : [5972]}
testOptionsDialogRetention.meta = {litmusids : [5971]};
