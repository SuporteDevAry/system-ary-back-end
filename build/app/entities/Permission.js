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
exports.Permission = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Permission = /** @class */ (function () {
    function Permission() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Permission.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "jsonb", nullable: true, default: [] }),
        __metadata("design:type", Array)
    ], Permission.prototype, "rules", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Permission.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Permission.prototype, "updated_at", void 0);
    Permission = __decorate([
        (0, typeorm_1.Entity)("permissions"),
        __metadata("design:paramtypes", [])
    ], Permission);
    return Permission;
}());
exports.Permission = Permission;
//# sourceMappingURL=Permission.js.map