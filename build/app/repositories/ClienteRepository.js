"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientes = exports.clienteRepository = void 0;
var Cliente_1 = require("../entities/Cliente");
var data_source_1 = require("../../database/data-source");
exports.clienteRepository = data_source_1.AppDataSource.getRepository(Cliente_1.Cliente);
var getClientes = function () { return exports.clienteRepository.find(); };
exports.getClientes = getClientes;
//# sourceMappingURL=ClienteRepository.js.map