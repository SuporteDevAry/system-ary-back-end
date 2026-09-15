"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHistoryRepository = void 0;
const data_source_1 = require("../../database/data-source");
const LoginHistory_1 = require("../entities/LoginHistory");
exports.loginHistoryRepository = data_source_1.AppDataSource.getRepository(LoginHistory_1.LoginHistory);
//# sourceMappingURL=LoginHistoryRepository.js.map