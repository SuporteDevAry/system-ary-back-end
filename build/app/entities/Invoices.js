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
exports.Invoice = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Invoice = /** @class */ (function () {
    function Invoice() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    Invoice.prototype.updateTimestamp = function () {
        this.updated_at = new Date();
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Invoice.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Invoice.prototype, "rps_number", void 0);
    __decorate([
        (0, typeorm_1.Column)("timestamp"),
        __metadata("design:type", Date)
    ], Invoice.prototype, "rps_emission_date", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Invoice.prototype, "nfs_number", void 0);
    __decorate([
        (0, typeorm_1.Column)("timestamp"),
        __metadata("design:type", Date)
    ], Invoice.prototype, "nfs_emission_date", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Invoice.prototype, "service_code", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "aliquot", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "cpf_cnpj", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "number", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "complement", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "district", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "city", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "state", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "zip_code", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Invoice.prototype, "service_discrim", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "service_value", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Invoice.prototype, "name_adjust1", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "value_adjust1", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Invoice.prototype, "name_adjust2", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "value_adjust2", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "deduction_value", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "irrf_value", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", String)
    ], Invoice.prototype, "service_liquid_value", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Invoice.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "timestamp",
            default: function () { return "CURRENT_TIMESTAMP"; },
            onUpdate: "CURRENT_TIMESTAMP",
        }),
        __metadata("design:type", Date)
    ], Invoice.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeUpdate)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Invoice.prototype, "updateTimestamp", null);
    Invoice = __decorate([
        (0, typeorm_1.Entity)("invoices"),
        __metadata("design:paramtypes", [])
    ], Invoice);
    return Invoice;
}());
exports.Invoice = Invoice;
//# sourceMappingURL=Invoices.js.map