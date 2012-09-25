/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var tabViews = require("../tabview");

const TIMEOUT = 5000;

const NODES = [
  {type: "contentArea", parent: undefined},
  {type: "deck", parent: undefined},
  {type: "exitButton", parent: undefined},
  {type: "search_box", parent: undefined},
  {type: "search_button", parent: undefined},
];

function setupModule() {
  controller = mozmill.getBrowserController();
  tabView = new tabViews.tabView(controller);
}

function testTabViewClass() {
  // Open and close TabView
  tabView.open();
  tabView.close();

  // Reopen again for upcoming tests
  tabView.open();

  // Test all available elements
  NODES.forEach(function (element) {
    var node = tabView.getElement({
      type: element.type,
      subtype: element.subtype,
      value: element.value,
      parent: element.parent
    });

    controller.assertNode(node);
  });


  controller.assert(function () {
    return tabView.getGroups().length == 1;
  }, "One tab group exists");

  // Get the first group and its title
  var groups = tabView.getGroups();
  var title = tabView.getGroupTitleBox({group: groups[0]});

  // Check if the same tab group we are getting by default title is identical
  var groupByTitle = tabView.getGroups({
    filter: "title",
    value: title.getNode().value
  })[0];

  controller.assert(function () {
    return groups[0].getNode() == groupByTitle.getNode();
  }, "Group get from index is identical to the group get from title");

  // Check if the the active tab group is identical to the first one
  var groupByActive = tabView.getGroups({filter: "active"})[0];
  controller.assert(function () {
    return groups[0].getNode() == groupByActive.getNode();
  }, "Group get from index is identical to the active group");

  // Setting a new title for the first tab group
  var name = "First Tab Group";
  controller.type(title, name);

  controller.assert(function () {
    return title.getNode().value == name;
  }, "New group title has been set");

  // Add a new tab to the first tab group
  var tabCountBefore = tabView.getTabs().length;

  // Open a new tab
  tabView.openTab({group: groups[0]});

  // TabView will be closed. So lets reopen it again with a website loaded
  controller.open("http://www.mozilla.org");
  controller.waitForPageLoad();

  var pageTitle = controller.tabs.activeTab.title;
  tabView.open();

  controller.assert(function () {
    return tabView.getTabs().length == tabCountBefore + 1;
  }, "The new tab should be visible when reopening the TabView");

  // Get the tabs from inside the first group
  var tabs = tabView.getTabs({filter: "group", value: groups[0]});

  controller.assert(function () {
    return tabView.getTabs().length == tabs.length;
  }, "The number of tabs in the default group matches the number of all tabs");

  // The active tab should be the Add-ons Website
  var tab = tabView.getTabs({filter: "active"})[0];
  var title = tabView.getTabTitleBox({tab: tab});
  controller.assertText(title, pageTitle);

  // Reset Tab View settings
  tabView.reset();

  tabView.open();
  groups = tabView.getGroups();

  // There shouldn't exist a tab not assigned to a group
  var tabsNoGroup = tabView.getTabs({filter: "group"});
  controller.assert(function () {
    return tabsNoGroup.length == 0;
  }, "No tab without a group should exist");

  // Close the first tab group and undo the action
  tabView.closeGroup({group: groups[0]});
  tabView.undoCloseGroup({group: groups[0]});

  tabView.close();
}