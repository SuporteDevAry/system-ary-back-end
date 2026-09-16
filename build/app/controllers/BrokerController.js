"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerController = void 0;
const BrokerRepository_1 = require("../repositories/BrokerRepository");
exports.BrokerController = {
    async createBroker(req, res) {
        const broker = await BrokerRepository_1.BrokerRepository.create(req.body);
        return res.status(201).json(broker);
    },
    async findAllBrokers(_, res) {
        const brokers = await BrokerRepository_1.BrokerRepository.findAll();
        return res.json(brokers);
    },
    async findBrokerById(req, res) {
        const { id } = req.params;
        const broker = await BrokerRepository_1.BrokerRepository.findById(id);
        if (!broker)
            return res.status(404).json({ message: "Broker não encontrado" });
        return res.json(broker);
    },
    async updateBroker(req, res) {
        const { id } = req.params;
        const updated = await BrokerRepository_1.BrokerRepository.update(id, req.body);
        return res.json(updated);
    },
    async deleteBroker(req, res) {
        const { id } = req.params;
        await BrokerRepository_1.BrokerRepository.delete(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=BrokerController.js.map