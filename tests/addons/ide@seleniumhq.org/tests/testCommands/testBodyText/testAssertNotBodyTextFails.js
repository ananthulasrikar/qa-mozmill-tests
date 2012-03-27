/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var selenium = require("../../../lib/selenium");
var checks = require("../../../lib/checks");

function setupModule(module) {
  controller = mozmill.getBrowserController();
  sm = new selenium.SeleniumManager();
  sm.open(controller);
}

function teardownModule(module) {
  sm.close();
}

function testAssertNotBodyTextCommandFails() {
  sm.baseURL = "chrome://selenium-ide/";
  sm.addCommand({action: "open",
                target: "/content/tests/functional/aut/search.html"});
  sm.addCommand({action: "assertNotBodyText",
                target: "regexp:.*link with onclick attribute.*"});
  sm.addCommand({action: "echo",
                target: "final command"});
  sm.playTest();

  checks.commandFailed(sm, "Actual value 'link with onclick attribute " +
                           "\n Show 10 20 30 items \n \n tab 1 tab 2'" +
                           " did match 'regexp:.*link with onclick attribute.*'");
  
  //check final command is not executed
  sm.controller.assert(function () {
    return sm.finalLogInfoMessage !== "echo: final command";
  }, "Final command was not executed, got '" + sm.finalLogInfoMessage +"'");
}
