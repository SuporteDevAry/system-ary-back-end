"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClients = exports.clientRepository = void 0;
var data_source_1 = require("../../database/data-source");
var Client_1 = require("../entities/Client");
exports.clientRepository = data_source_1.AppDataSource.getRepository(Client_1.Client);
var getClients = function () { return exports.clientRepository.find(); };
exports.getClients = getClients;
//# sourceMappingURL=ClientRepository.js.map