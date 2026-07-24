"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const NotificationsRepository_1 = require("../repositories/NotificationsRepository");
class NotificationController {
    async getProfile(req, res) {
        return res.json(req.user);
    }
    async getNotifications(req, res) {
        const notifications = await (0, NotificationsRepository_1.getNotifications)();
        return res.status(200).json(notifications);
    }
    async getNotificationsByUser(req, res) {
        const { user } = req.params;
        if (!user) {
            throw new api_errors_1.BadRequestError("Usuário não informado.");
        }
        const notificationsSearched = await NotificationsRepository_1.notificationsRepository.findBy({
            user,
        });
        return res.status(200).json(notificationsSearched);
    }
    async getNotificationById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new api_errors_1.BadRequestError("ID de notificação não informado.");
        }
        const notificationsSearched = await NotificationsRepository_1.notificationsRepository.findOneBy({
            id,
        });
        if (!notificationsSearched) {
            throw new api_errors_1.BadRequestError("ID de notificação não encontrado.");
        }
        return res.status(200).json(notificationsSearched);
    }
    async create(req, res) {
        const { id, user, read, content, type, isLoading } = req.body;
        const notificationsExists = await NotificationsRepository_1.notificationsRepository.findOneBy({ id });
        // if (notificationsExists) {
        //     throw new BadRequestError("ID de notificação já existente.");
        // }
        const newNotification = NotificationsRepository_1.notificationsRepository.create({
            id,
            user,
            read,
            content,
            type,
            isLoading,
        });
        await NotificationsRepository_1.notificationsRepository.save(newNotification);
        const notification = __rest(newNotification, []);
        return res.status(201).json(notification);
    }
    async updateNotification(req, res) {
        const { id } = req.params;
        const { read } = req.body;
        if (!id) {
            throw new api_errors_1.BadRequestError("ID da notificação não informado.");
        }
        const notificationToUpdate = await NotificationsRepository_1.notificationsRepository.findOneBy({
            id,
        });
        if (!notificationToUpdate) {
            throw new api_errors_1.BadRequestError("Notificação não encontrada.");
        }
        if (typeof read === "boolean") {
            notificationToUpdate.read = read;
        }
        if (read)
            notificationToUpdate.read = read;
        await NotificationsRepository_1.notificationsRepository.save(notificationToUpdate);
        const updatedNotification = __rest(notificationToUpdate, []);
        return res.status(200).json(updatedNotification);
    }
    async deleteNotification(req, res) {
        const { id } = req.params;
        const notificationToDelete = await NotificationsRepository_1.notificationsRepository.findOneBy({
            id,
        });
        if (!notificationToDelete) {
            throw new api_errors_1.BadRequestError("ID de notificação não encontrada.");
        }
        await NotificationsRepository_1.notificationsRepository.remove(notificationToDelete);
        return res.status(204).send();
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationsController.js.map