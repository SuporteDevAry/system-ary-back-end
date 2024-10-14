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
exports.GrainContract = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var GrainContract = /** @class */ (function () {
    function GrainContract() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    GrainContract.prototype.updateTimestamp = function () {
        this.updated_at = new Date();
    };
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "number_broker", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "jsonb", nullable: true, default: [] }),
        __metadata("design:type", Array)
    ], GrainContract.prototype, "seller", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "jsonb", nullable: true, default: [] }),
        __metadata("design:type", Array)
    ], GrainContract.prototype, "buyer", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "jsonb", nullable: true, default: [] }),
        __metadata("design:type", Array)
    ], GrainContract.prototype, "list_email_seller", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "jsonb", nullable: true, default: [] }),
        __metadata("design:type", Array)
    ], GrainContract.prototype, "list_email_buyer", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "product", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "name_product", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "crop", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "quality", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", Number)
    ], GrainContract.prototype, "quantity", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", Number)
    ], GrainContract.prototype, "quantity_kg", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", Number)
    ], GrainContract.prototype, "quantity_bag", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "type_currency", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", Number)
    ], GrainContract.prototype, "price", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "type_icms", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "icms", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "payment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "commission_seller", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "commission_buyer", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "type_pickup", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "pickup", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "pickup_location", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "inspection", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "observation", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "number_contract", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "owner_contract", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "type_commission_seller", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "type_commission_buyer", void 0);
    __decorate([
        (0, typeorm_1.Column)("decimal"),
        __metadata("design:type", Number)
    ], GrainContract.prototype, "total_contract_value", void 0);
    __decorate([
        (0, typeorm_1.Column)("jsonb", { nullable: true }),
        __metadata("design:type", Object)
    ], GrainContract.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "contract_emission_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "destination", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "number_external_contract_buyer", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "number_external_contract_seller", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "day_exchange_rate", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "payment_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "farm_direct", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], GrainContract.prototype, "initial_pickup_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "final_pickup_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], GrainContract.prototype, "internal_communication", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], GrainContract.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "timestamp",
            default: function () { return "CURRENT_TIMESTAMP"; },
            onUpdate: "CURRENT_TIMESTAMP",
        }),
        __metadata("design:type", Date)
    ], GrainContract.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeUpdate)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], GrainContract.prototype, "updateTimestamp", null);
    GrainContract = __decorate([
        (0, typeorm_1.Entity)("grain_contracts"),
        __metadata("design:paramtypes", [])
    ], GrainContract);
    return GrainContract;
}());
exports.GrainContract = GrainContract;
//# sourceMappingURL=GrainContracts.js.map