"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const searchAndTranslate_1 = require("./commands/searchAndTranslate");
const searchAndDisplay_1 = require("./commands/searchAndDisplay");
function activate(context) {
    // Register the command to search and translate Jira issues
    (0, searchAndTranslate_1.registerSearchAndTranslateCommand)(context);
    // Register the command to search and display Jira tickets
    (0, searchAndDisplay_1.registerSearchAndDisplayCommand)(context);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
