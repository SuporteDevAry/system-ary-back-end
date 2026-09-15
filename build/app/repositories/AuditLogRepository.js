"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = void 0;
const data_source_1 = require("../../database/data-source");
const AuditLog_1 = require("../entities/AuditLog");
exports.auditLogRepository = data_source_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
//# sourceMappingURL=AuditLogRepository.js.map