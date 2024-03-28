"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContatos = exports.contatosRepository = void 0;
var Contatos_1 = require("../entities/Contatos");
var data_source_1 = require("../../database/data-source");
exports.contatosRepository = data_source_1.AppDataSource.getRepository(Contatos_1.Contatos);
var getContatos = function () { return exports.contatosRepository.find(); };
exports.getContatos = getContatos;
//# sourceMappingURL=ContatosRepository.js.map