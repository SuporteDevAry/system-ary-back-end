"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationDir = void 0;
var _1694720577496_createUsers_1 = require("./1694720577496-createUsers");
var _1697084968105_permissions_1 = require("./1697084968105-permissions");
var _1720832053181_AddClientNew_1 = require("./1720832053181-AddClientNew");
var _1720831489814_AddClientContactsRelation_1 = require("./1720831489814-AddClientContactsRelation");
var _1716314850943_Notifications_1 = require("./1716314850943-Notifications");
var _1724183698162_GrainContract_1 = require("./1724183698162-GrainContract");
var _1732715196786_AddComplementationDestination_1 = require("./1732715196786-AddComplementationDestination");
var _1733888615818_EmailLogs_1 = require("./1733888615818-EmailLogs");
var _1742958762694_AddReceiveEmailInContacts_1 = require("./1742958762694-AddReceiveEmailInContacts");
var _1747783875290_addTypeQuantity_1 = require("./1747783875290-addTypeQuantity");
var _1754078917113_products_1 = require("./1754078917113-products");
var _1754444551923_productsTable_1 = require("./1754444551923-productsTable");
var _1755633180693_AddTableId_1 = require("./1755633180693-AddTableId");
var _1756778991841_AddReceiptFields_1 = require("./1756778991841-AddReceiptFields");
var _1756780745306_Taxes_1 = require("./1756780745306-Taxes");
var _1757045893213_Invoices_1 = require("./1757045893213-Invoices");
var _1757048894259_Billing_1 = require("./1757048894259-Billing");
var _1756778999999_AddContractEmissionDatetime_1 = require("./1756778999999-AddContractEmissionDatetime");
exports.migrationDir = {
    CreatePermissions: _1697084968105_permissions_1.Permissions1697084968105,
    CreateUsers: _1694720577496_createUsers_1.CreateUsers1694720577496,
    AddClientNew: _1720832053181_AddClientNew_1.AddClientNew1720832053181,
    AddClientContactsRelation: _1720831489814_AddClientContactsRelation_1.AddClientContactsRelation1720831489814,
    Notifications: _1716314850943_Notifications_1.Notifications1716314850943,
    GrainContract: _1724183698162_GrainContract_1.GrainContract1724183698162,
    AddComplementationDestination: _1732715196786_AddComplementationDestination_1.AddComplementationDestination1732715196786,
    EmailLog: _1733888615818_EmailLogs_1.EmailLogs1733888615818,
    AddReceiveEmailInContacts: _1742958762694_AddReceiveEmailInContacts_1.AddReceiveEmailInContacts1742958762694,
    AddTypeQuantity: _1747783875290_addTypeQuantity_1.AddTypeQuantity1747783875290,
    Products: _1754078917113_products_1.Products1754078917113,
    ProductsTable: _1754444551923_productsTable_1.ProductsTable1754444551923,
    AddTableIdInGrainContracts: _1755633180693_AddTableId_1.AddTableId1755633180693,
    AddReceiptFields: _1756778991841_AddReceiptFields_1.AddReceiptFields1756778991841,
    Taxes: _1756780745306_Taxes_1.Taxes1756780745306,
    Invoices: _1757045893213_Invoices_1.Invoices1757045893213,
    Billings: _1757048894259_Billing_1.Billing1757048894259,
    AddContractEmissionDatetime: _1756778999999_AddContractEmissionDatetime_1.AddContractEmissionDatetime1756778999999,
};
//# sourceMappingURL=index.js.map