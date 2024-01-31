"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var errorMiddleware = function (error, req, res, next) {
    var _a;
    var statusCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    var message = error.statusCode ? error.message : "Internal Server Error!";
    return res.status(statusCode).json({ message: message });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.js.map