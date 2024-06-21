"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = exports.notificationsRepository = void 0;
var data_source_1 = require("../../database/data-source");
var Notifications_1 = require("../entities/Notifications");
exports.notificationsRepository = data_source_1.AppDataSource.getRepository(Notifications_1.Notifications);
var getNotifications = function () { return exports.notificationsRepository.find(); };
exports.getNotifications = getNotifications;
//# sourceMappingURL=NotificationsRepository.js.map