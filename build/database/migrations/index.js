"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationDir = void 0;
var _1694720577496_createUsers_1 = require("./1694720577496-createUsers");
var _1697084968105_permissions_1 = require("./1697084968105-permissions");
var _1720832053181_AddClientNew_1 = require("./1720832053181-AddClientNew");
var _1721239748864_AddUniqueConstraintToCodeClient_1 = require("./1721239748864-AddUniqueConstraintToCodeClient");
var _1720831489814_AddClientContactsRelation_1 = require("./1720831489814-AddClientContactsRelation");
var _1716314850943_Notifications_1 = require("./1716314850943-Notifications");
var _1724183698162_GrainContract_1 = require("./1724183698162-GrainContract");
var _1727823800099_AddAccountFieldToClient_1 = require("./1727823800099-AddAccountFieldToClient");
var _1729128019349_AddCnpj_pagtoFieldToClient_1 = require("./1729128019349-AddCnpj_pagtoFieldToClient");
exports.migrationDir = {
    CreateUsers: _1694720577496_createUsers_1.CreateUsers1694720577496,
    CreatePermissions: _1697084968105_permissions_1.Permissions1697084968105,
    AddClientNew: _1720832053181_AddClientNew_1.AddClientNew1720832053181,
    AddUniqueConstraintToCodeClient: _1721239748864_AddUniqueConstraintToCodeClient_1.AddUniqueConstraintToCodeClient1721239748864,
    AddClientContactsRelation: _1720831489814_AddClientContactsRelation_1.AddClientContactsRelation1720831489814,
    Notifications: _1716314850943_Notifications_1.Notifications1716314850943,
    GrainContract: _1724183698162_GrainContract_1.GrainContract1724183698162,
    AddAccountFieldToClient: _1727823800099_AddAccountFieldToClient_1.AddAccountFieldToClient1727823800099,
    AddCnpjPagtoFieldToClient: _1729128019349_AddCnpj_pagtoFieldToClient_1.AddCnpjPagtoFieldToClient1729128019349
};
//# sourceMappingURL=index.js.map