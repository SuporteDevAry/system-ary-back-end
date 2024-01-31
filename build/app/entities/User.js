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
exports.User = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Permission_1 = require("./Permission");
var User = /** @class */ (function () {
    function User() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "uuid" }),
        __metadata("design:type", String)
    ], User.prototype, "permissions_id", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return Permission_1.Permission; }),
        (0, typeorm_1.JoinColumn)({ name: "permissions_id" }),
        __metadata("design:type", Permission_1.Permission)
    ], User.prototype, "permissions", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "updated_at", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)("users"),
        __metadata("design:paramtypes", [])
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map