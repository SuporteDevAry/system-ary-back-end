"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Billing = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Billing = /** @class */ (function () {
    function Billing() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    Billing.prototype.updateTimestamp = function () {
        this.updated_at = new Date();
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Billing.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "number_contract", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "product_name", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "number_broker", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "year", void 0);
    __decorate([
        (0, typeorm_1.Column)("timestamp"),
        __metadata("design:type", Date)
    ], Billing.prototype, "receipt_date", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "internal_receipt_number", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "rps_number", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "nfs_number", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Billing.prototype, "total_service_value", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Billing.prototype, "irrf_value", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Billing.prototype, "adjustment_value", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Billing.prototype, "liquid_value", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "liquid_contract", void 0);
    __decorate([
        (0, typeorm_1.Column)("timestamp"),
        __metadata("design:type", Date)
    ], Billing.prototype, "expected_receipt_date", void 0);
    __decorate([
        (0, typeorm_1.Column)("timestamp"),
        __metadata("design:type", Date)
    ], Billing.prototype, "liquid_contract_date", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Billing.prototype, "owner_record", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Billing.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "timestamp",
            default: function () { return "CURRENT_TIMESTAMP"; },
            onUpdate: "CURRENT_TIMESTAMP",
        }),
        __metadata("design:type", Date)
    ], Billing.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeUpdate)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Billing.prototype, "updateTimestamp", null);
    Billing = __decorate([
        (0, typeorm_1.Entity)("billings"),
        __metadata("design:paramtypes", [])
    ], Billing);
    return Billing;
}());
exports.Billing = Billing;
//# sourceMappingURL=Billings.js.map