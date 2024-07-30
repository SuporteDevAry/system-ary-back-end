"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRepository = void 0;
var data_source_1 = require("../../database/data-source");
var Contact_1 = require("../entities/Contact");
exports.contactRepository = data_source_1.AppDataSource.getRepository(Contact_1.Contact);
//# sourceMappingURL=ContactRepository.js.map