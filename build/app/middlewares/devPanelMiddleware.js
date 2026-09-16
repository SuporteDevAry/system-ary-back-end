"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.devPanelMiddleware = void 0;
const api_errors_1 = require("../helpers/api-errors");
const allowedEmails = ((_a = process.env.DEV_PANEL_ALLOWED_EMAILS) !== null && _a !== void 0 ? _a : "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
const devPanelMiddleware = (req, res, next) => {
    var _a, _b;
    const email = ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "").toLowerCase();
    if (!allowedEmails.includes(email)) {
        throw new api_errors_1.ForbiddenError("Acesso restrito.");
    }
    next();
};
exports.devPanelMiddleware = devPanelMiddleware;
//# sourceMappingURL=devPanelMiddleware.js.map