"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLogRepository = void 0;
const data_source_1 = require("../../database/data-source");
const EmailLog_1 = require("../entities/EmailLog");
exports.EmailLogRepository = data_source_1.AppDataSource.getRepository(EmailLog_1.EmailLog);
//# sourceMappingURL=EmailLogRepository.js.map