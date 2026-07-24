"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = exports.notificationsRepository = void 0;
const data_source_1 = require("../../database/data-source");
const Notifications_1 = require("../entities/Notifications");
exports.notificationsRepository = data_source_1.AppDataSource.getRepository(Notifications_1.Notifications);
const getNotifications = () => exports.notificationsRepository.find();
exports.getNotifications = getNotifications;
//# sourceMappingURL=NotificationsRepository.js.map