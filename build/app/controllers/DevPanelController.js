"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevPanelController = void 0;
const AuditLogRepository_1 = require("../repositories/AuditLogRepository");
const LoginHistoryRepository_1 = require("../repositories/LoginHistoryRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const ActiveSessionRepository_1 = require("../repositories/ActiveSessionRepository");
const DEFAULT_LIMIT = 50;
const AUDIT_LOG_DEFAULT_DAYS = 90;
const AUDIT_LOG_MAX_ROWS = 1000;
const ONLINE_THRESHOLD_SECONDS = 60;
class DevPanelController {
    async getLoginHistory(req, res) {
        const { email, from, to, page = "0", limit = String(DEFAULT_LIMIT), } = req.query;
        const qb = LoginHistoryRepository_1.loginHistoryRepository
            .createQueryBuilder("login_history")
            .orderBy("login_history.created_at", "DESC");
        if (email) {
            qb.andWhere("login_history.email = :email", { email });
        }
        if (from) {
            qb.andWhere("login_history.created_at >= :from", { from });
        }
        if (to) {
            qb.andWhere("login_history.created_at <= :to", { to });
        }
        const take = Number(limit);
        const skip = Number(page) * take;
        const [data, total] = await qb.take(take).skip(skip).getManyAndCount();
        return res.status(200).json({ data, total });
    }
    async getUserMetrics(req, res) {
        const users = await UserRepository_1.userRepository.find();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const lastLogins = await LoginHistoryRepository_1.loginHistoryRepository
            .createQueryBuilder("login_history")
            .select("login_history.user_id", "user_id")
            .addSelect("MAX(login_history.created_at)", "last_login")
            .groupBy("login_history.user_id")
            .getRawMany();
        const loginsThisMonth = await LoginHistoryRepository_1.loginHistoryRepository
            .createQueryBuilder("login_history")
            .select("login_history.user_id", "user_id")
            .addSelect("COUNT(*)", "count")
            .where("login_history.created_at >= :startOfMonth", { startOfMonth })
            .groupBy("login_history.user_id")
            .getRawMany();
        const lastLoginByUser = new Map(lastLogins.map((row) => [row.user_id, row.last_login]));
        const loginsThisMonthByUser = new Map(loginsThisMonth.map((row) => [row.user_id, Number(row.count)]));
        const metrics = users.map((user) => {
            var _a, _b;
            return ({
                id: user.id,
                name: user.name,
                email: user.email,
                last_login: (_a = lastLoginByUser.get(user.id)) !== null && _a !== void 0 ? _a : null,
                logins_this_month: (_b = loginsThisMonthByUser.get(user.id)) !== null && _b !== void 0 ? _b : 0,
            });
        });
        return res.status(200).json(metrics);
    }
    async getAuditLog(req, res) {
        const { entity_name, user_email, action, from, to, page = "0", limit = String(DEFAULT_LIMIT), } = req.query;
        const qb = AuditLogRepository_1.auditLogRepository
            .createQueryBuilder("audit_log")
            .orderBy("audit_log.created_at", "DESC");
        if (entity_name) {
            qb.andWhere("audit_log.entity_name = :entity_name", { entity_name });
        }
        if (user_email) {
            qb.andWhere("audit_log.user_email = :user_email", { user_email });
        }
        if (action) {
            qb.andWhere("audit_log.action = :action", { action });
        }
        if (from) {
            qb.andWhere("audit_log.created_at >= :from", { from });
        }
        else {
            const defaultFrom = new Date(Date.now() - AUDIT_LOG_DEFAULT_DAYS * 24 * 60 * 60 * 1000);
            qb.andWhere("audit_log.created_at >= :defaultFrom", { defaultFrom });
        }
        if (to) {
            qb.andWhere("audit_log.created_at <= :to", { to });
        }
        const take = Math.min(Number(limit), AUDIT_LOG_MAX_ROWS);
        const skip = Number(page) * take;
        const [data, total] = await qb.take(take).skip(skip).getManyAndCount();
        return res.status(200).json({ data, total });
    }
    async getOnlineUsers(req, res) {
        const threshold = new Date(Date.now() - ONLINE_THRESHOLD_SECONDS * 1000);
        const onlineUsers = await ActiveSessionRepository_1.activeSessionRepository
            .createQueryBuilder("active_session")
            .where("active_session.last_seen_at >= :threshold", { threshold })
            .orderBy("active_session.last_seen_at", "DESC")
            .getMany();
        return res.status(200).json(onlineUsers);
    }
}
exports.DevPanelController = DevPanelController;
//# sourceMappingURL=DevPanelController.js.map