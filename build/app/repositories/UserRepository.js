"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.userRepository = void 0;
var User_1 = require("../entities/User");
var data_source_1 = require("../../database/data-source");
// import { FindOptionsWhere } from "typeorm";
exports.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
var getUsers = function () { return exports.userRepository.find(); };
exports.getUsers = getUsers;
//# sourceMappingURL=UserRepository.js.map