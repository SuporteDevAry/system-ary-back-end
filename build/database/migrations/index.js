"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationDir = void 0;
var _1694720577496_createUsers_1 = require("./1694720577496-createUsers");
var _1697084968105_permissions_1 = require("./1697084968105-permissions");
var _1709764504705_createClientes_1 = require("./1709764504705-createClientes");
var _1710886127461_createContatos_1 = require("./1710886127461-createContatos");
<<<<<<< HEAD
var _1720832053181_AddClientNew_1 = require("./1720832053181-AddClientNew");
var _1721239748864_AddUniqueConstraintToCodeClient_1 = require("./1721239748864-AddUniqueConstraintToCodeClient");
var _1720831489814_AddClientContactsRelation_1 = require("./1720831489814-AddClientContactsRelation");
=======
var _1716314850943_Notifications_1 = require("./1716314850943-Notifications");
>>>>>>> feature/notification
exports.migrationDir = {
    CreateUsers: _1694720577496_createUsers_1.CreateUsers1694720577496,
    CreatePermissions: _1697084968105_permissions_1.Permissions1697084968105,
    CreateClientes: _1709764504705_createClientes_1.CreateClientes1709764504705,
    CreateContatos: _1710886127461_createContatos_1.CreateContatos1710886127461,
<<<<<<< HEAD
    AddClientNew: _1720832053181_AddClientNew_1.AddClientNew1720832053181,
    AddUniqueConstraintToCodeClient: _1721239748864_AddUniqueConstraintToCodeClient_1.AddUniqueConstraintToCodeClient1721239748864,
    AddClientContactsRelation: _1720831489814_AddClientContactsRelation_1.AddClientContactsRelation1720831489814,
=======
    Notifications: _1716314850943_Notifications_1.Notifications1716314850943
>>>>>>> feature/notification
};
//# sourceMappingURL=index.js.map