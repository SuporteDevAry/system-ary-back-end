"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientes = exports.clientesRepository = void 0;
var Clientes_1 = require("../entities/Clientes");
var data_source_1 = require("../../database/data-source");
exports.clientesRepository = data_source_1.AppDataSource.getRepository(Clientes_1.Clientes);
var getClientes = function () { return exports.clientesRepository.find(); };
exports.getClientes = getClientes;
//# sourceMappingURL=ClientesRepository.js.map