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
exports.Notifications = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var Notifications = /** @class */ (function () {
    function Notifications() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    Notifications.prototype.updateTimestamp = function () {
        this.updated_at = new Date();
    };
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Notifications.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Notifications.prototype, "user", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "boolean" }),
        __metadata("design:type", Boolean)
    ], Notifications.prototype, "read", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Notifications.prototype, "content", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Notifications.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "boolean" }),
        __metadata("design:type", Boolean)
    ], Notifications.prototype, "isLoading", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Notifications.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP"; }, onUpdate: "CURRENT_TIMESTAMP" }),
        __metadata("design:type", Date)
    ], Notifications.prototype, "updated_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeUpdate)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Notifications.prototype, "updateTimestamp", null);
    Notifications = __decorate([
        (0, typeorm_1.Entity)("notifications"),
        __metadata("design:paramtypes", [])
    ], Notifications);
    return Notifications;
}());
exports.Notifications = Notifications;
//# sourceMappingURL=Notifications.js.map