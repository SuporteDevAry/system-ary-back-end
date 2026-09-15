"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.runWithUserContext = void 0;
const async_hooks_1 = require("async_hooks");
const storage = new async_hooks_1.AsyncLocalStorage();
function runWithUserContext(user, fn) {
    return storage.run(user, fn);
}
exports.runWithUserContext = runWithUserContext;
function getCurrentUser() {
    return storage.getStore();
}
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=requestContext.js.map