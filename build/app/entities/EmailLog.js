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
exports.EmailLog = void 0;
var typeorm_1 = require("typeorm");
var EmailLog = /** @class */ (function () {
    function EmailLog() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], EmailLog.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], EmailLog.prototype, "email_sender", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], EmailLog.prototype, "number_contract", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], EmailLog.prototype, "sent_at", void 0);
    EmailLog = __decorate([
        (0, typeorm_1.Entity)("email_logs")
    ], EmailLog);
    return EmailLog;
}());
exports.EmailLog = EmailLog;
//# sourceMappingURL=EmailLog.js.map