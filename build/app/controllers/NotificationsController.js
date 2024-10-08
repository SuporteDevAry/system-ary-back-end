"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var api_errors_1 = require("../helpers/api-errors");
var NotificationsRepository_1 = require("../repositories/NotificationsRepository");
var NotificationController = /** @class */ (function () {
    function NotificationController() {
    }
    NotificationController.prototype.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.json(req.user)];
            });
        });
    };
    NotificationController.prototype.getNotifications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, NotificationsRepository_1.getNotifications)()];
                    case 1:
                        notifications = _a.sent();
                        return [2 /*return*/, res.status(200).json(notifications)];
                }
            });
        });
    };
    NotificationController.prototype.getNotificationsByUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, notificationsSearched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.params.user;
                        if (!user) {
                            throw new api_errors_1.BadRequestError("Usuário não informado.");
                        }
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.findBy({
                                user: user,
                            })];
                    case 1:
                        notificationsSearched = _a.sent();
                        return [2 /*return*/, res.status(200).json(notificationsSearched)];
                }
            });
        });
    };
    NotificationController.prototype.getNotificationById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, notificationsSearched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            throw new api_errors_1.BadRequestError("ID de notificação não informado.");
                        }
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.findOneBy({
                                id: id,
                            })];
                    case 1:
                        notificationsSearched = _a.sent();
                        if (!notificationsSearched) {
                            throw new api_errors_1.BadRequestError("ID de notificação não encontrado.");
                        }
                        return [2 /*return*/, res.status(200).json(notificationsSearched)];
                }
            });
        });
    };
    NotificationController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, user, read, content, type, isLoading, notificationsExists, newNotification, notification;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, user = _a.user, read = _a.read, content = _a.content, type = _a.type, isLoading = _a.isLoading;
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.findOneBy({ id: id })];
                    case 1:
                        notificationsExists = _b.sent();
                        newNotification = NotificationsRepository_1.notificationsRepository.create({
                            id: id,
                            user: user,
                            read: read,
                            content: content,
                            type: type,
                            isLoading: isLoading,
                        });
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.save(newNotification)];
                    case 2:
                        _b.sent();
                        notification = __rest(newNotification, []);
                        return [2 /*return*/, res.status(201).json(notification)];
                }
            });
        });
    };
    NotificationController.prototype.updateNotification = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, read, notificationToUpdate, updatedNotification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        read = req.body.read;
                        if (!id) {
                            throw new api_errors_1.BadRequestError("ID da notificação não informado.");
                        }
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.findOneBy({
                                id: id,
                            })];
                    case 1:
                        notificationToUpdate = _a.sent();
                        if (!notificationToUpdate) {
                            throw new api_errors_1.BadRequestError("Notificação não encontrada.");
                        }
                        if (typeof read === "boolean") {
                            notificationToUpdate.read = read;
                        }
                        if (read)
                            notificationToUpdate.read = read;
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.save(notificationToUpdate)];
                    case 2:
                        _a.sent();
                        updatedNotification = __rest(notificationToUpdate, []);
                        return [2 /*return*/, res.status(200).json(updatedNotification)];
                }
            });
        });
    };
    NotificationController.prototype.deleteNotification = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, notificationToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.findOneBy({
                                id: id,
                            })];
                    case 1:
                        notificationToDelete = _a.sent();
                        if (!notificationToDelete) {
                            throw new api_errors_1.BadRequestError("ID de notificação não encontrada.");
                        }
                        return [4 /*yield*/, NotificationsRepository_1.notificationsRepository.remove(notificationToDelete)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(204).send()];
                }
            });
        });
    };
    return NotificationController;
}());
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationsController.js.map