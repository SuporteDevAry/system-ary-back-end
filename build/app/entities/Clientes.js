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
exports.Clientes = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Clientes = /** @class */ (function () {
    function Clientes() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    Clientes.prototype.updateTimestamp = function () {
        this.updated_at = new Date();
    };
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Clientes.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "cli_codigo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "endereco", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "numero", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "complemento", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "bairro", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "cidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "uf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "cep", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "natureza", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "cnpj", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "ins_est", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "ins_mun", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "telefone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "celular", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Clientes.prototype, "situacao", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Clientes.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "timestamp",
            default: function () { return "CURRENT_TIMESTAMP"; },
            onUpdate: "CURRENT_TIMESTAMP",
        }),
        __metadata("design:type", Date)
    ], Clientes.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeUpdate)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Clientes.prototype, "updateTimestamp", null);
    Clientes = __decorate([
        (0, typeorm_1.Entity)("clientes"),
        (0, typeorm_1.Index)("unique_cli_codigo", ["cli_codigo"], { unique: true }),
        __metadata("design:paramtypes", [])
    ], Clientes);
    return Clientes;
}());
exports.Clientes = Clientes;
//# sourceMappingURL=Clientes.js.map