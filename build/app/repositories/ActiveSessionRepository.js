"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeSessionRepository = void 0;
const data_source_1 = require("../../database/data-source");
const ActiveSession_1 = require("../entities/ActiveSession");
exports.activeSessionRepository = data_source_1.AppDataSource.getRepository(ActiveSession_1.ActiveSession);
//# sourceMappingURL=ActiveSessionRepository.js.map