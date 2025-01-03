"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLogRepository = void 0;
var data_source_1 = require("../../database/data-source");
var EmailLog_1 = require("../entities/EmailLog");
exports.EmailLogRepository = data_source_1.AppDataSource.getRepository(EmailLog_1.EmailLog);
//# sourceMappingURL=EmailLogRepository.js.map