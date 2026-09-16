"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerRepository = void 0;
const data_source_1 = require("../../database/data-source");
const Broker_1 = require("../entities/Broker");
const repo = data_source_1.AppDataSource.getRepository(Broker_1.Broker);
exports.BrokerRepository = {
    async create(data) {
        const broker = repo.create(data);
        return await repo.save(broker);
    },
    async findAll() {
        return await repo.find();
    },
    async findById(id) {
        return await repo.findOneBy({ id });
    },
    async update(id, data) {
        const broker = await repo.findOneBy({ id });
        if (!broker)
            throw new Error("Broker não encontrado");
        Object.assign(broker, data);
        return await repo.save(broker);
    },
    async delete(id) {
        const broker = await repo.findOneBy({ id });
        if (!broker)
            throw new Error("Broker não encontrado");
        await repo.remove(broker);
    },
};
//# sourceMappingURL=BrokerRepository.js.map