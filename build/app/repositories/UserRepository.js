"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.userRepository = void 0;
const User_1 = require("../entities/User");
const data_source_1 = require("../../database/data-source");
// import { FindOptionsWhere } from "typeorm";
exports.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const getUsers = () => exports.userRepository.find();
exports.getUsers = getUsers;
//# sourceMappingURL=UserRepository.js.map