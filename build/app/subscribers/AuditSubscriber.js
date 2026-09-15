"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSubscriber = void 0;
const typeorm_1 = require("typeorm");
const AuditLog_1 = require("../entities/AuditLog");
const requestContext_1 = require("../helpers/requestContext");
const SKIP_ENTITIES = new Set(["AuditLog", "LoginHistory", "ActiveSession"]);
function sanitize(entity, entityName) {
    if (!entity)
        return null;
    const plain = JSON.parse(JSON.stringify(entity));
    if (entityName === "User") {
        delete plain.password;
    }
    return plain;
}
let AuditSubscriber = class AuditSubscriber {
    async record(event, entityName, action, entityId, before, after) {
        var _a, _b, _c;
        try {
            const currentUser = (0, requestContext_1.getCurrentUser)();
            const auditLog = new AuditLog_1.AuditLog();
            auditLog.user_id = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) !== null && _a !== void 0 ? _a : null;
            auditLog.user_email = (_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) !== null && _b !== void 0 ? _b : "system";
            auditLog.user_name = (_c = currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) !== null && _c !== void 0 ? _c : "system";
            auditLog.action = action;
            auditLog.entity_name = entityName;
            auditLog.entity_id = entityId;
            auditLog.before = before;
            auditLog.after = after;
            await event.manager.save(AuditLog_1.AuditLog, auditLog);
        }
        catch (error) {
            console.error("Falha ao gravar audit_log:", error);
        }
    }
    async afterInsert(event) {
        var _a, _b;
        const entityName = event.metadata.name;
        if (SKIP_ENTITIES.has(entityName))
            return;
        const entityId = (_b = (_a = event.entity) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        await this.record(event, entityName, "INSERT", entityId, null, sanitize(event.entity, entityName));
    }
    async afterUpdate(event) {
        var _a, _b, _c, _d;
        const entityName = event.metadata.name;
        if (SKIP_ENTITIES.has(entityName))
            return;
        const entityId = (_d = (_b = (_a = event.entity) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_c = event.databaseEntity) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null;
        await this.record(event, entityName, "UPDATE", entityId, sanitize(event.databaseEntity, entityName), sanitize(event.entity, entityName));
    }
    async beforeRemove(event) {
        var _a, _b, _c;
        const entityName = event.metadata.name;
        if (SKIP_ENTITIES.has(entityName))
            return;
        const entityId = (_c = (_b = (_a = event.entity) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : event.entityId) !== null && _c !== void 0 ? _c : null;
        await this.record(event, entityName, "REMOVE", entityId, sanitize(event.entity, entityName), null);
    }
};
exports.AuditSubscriber = AuditSubscriber;
exports.AuditSubscriber = AuditSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], AuditSubscriber);
//# sourceMappingURL=AuditSubscriber.js.map