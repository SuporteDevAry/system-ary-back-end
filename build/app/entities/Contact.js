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
exports.Contact = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Contact = /** @class */ (function () {
    function Contact() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    Contact.prototype.updateTimestamp = function () {
        this.updated_at = new Date();
    };
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Contact.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Contact.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Contact.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Contact.prototype, "sector", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Contact.prototype, "telephone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Contact.prototype, "cellphone", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Contact.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "timestamp",
            default: function () { return "CURRENT_TIMESTAMP"; },
            onUpdate: "CURRENT_TIMESTAMP",
        }),
        __metadata("design:type", Date)
    ], Contact.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeUpdate)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Contact.prototype, "updateTimestamp", null);
    __decorate([
        (0, typeorm_1.Column)({ type: "int" }),
        __metadata("design:type", Number)
    ], Contact.prototype, "code_client", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", default: "false" }),
        __metadata("design:type", String)
    ], Contact.prototype, "receive_email", void 0);
    Contact = __decorate([
        (0, typeorm_1.Entity)("contact"),
        __metadata("design:paramtypes", [])
    ], Contact);
    return Contact;
}());
exports.Contact = Contact;
//# sourceMappingURL=Contact.js.map