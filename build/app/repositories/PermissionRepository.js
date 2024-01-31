"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionRepository = void 0;
var Permission_1 = require("../entities/Permission");
var data_source_1 = require("../../database/data-source");
exports.permissionRepository = data_source_1.AppDataSource.getRepository(Permission_1.Permission);
//# sourceMappingURL=PermissionRepository.js.map