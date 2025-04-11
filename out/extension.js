"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const searchAndTranslate_1 = require("./commands/searchAndTranslate");
function activate(context) {
    // Register the command to search and translate Jira issues
    (0, searchAndTranslate_1.registerSearchAndTranslateCommand)(context);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
