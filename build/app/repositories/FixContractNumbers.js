"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../../database/data-source");
const GrainContracts_1 = require("../entities/GrainContracts");
// Definição dos grupos de produtos
const productGroups = {
    group1: ["S", "T", "SG", "CN"],
    group2: ["O"],
    group3: ["F"],
};
// Função para obter o grupo do produto
const getProductGroup = (product) => {
    for (const [group, products] of Object.entries(productGroups)) {
        if (products.includes(product)) {
            return group;
        }
    }
    return null;
};
const fixContractNumbers = async () => {
    await data_source_1.AppDataSource.initialize();
    const grainContractRepository = data_source_1.AppDataSource.getRepository(GrainContracts_1.GrainContract);
    // Buscar todos os contratos ordenados por grupo de produtos e data
    const contracts = await grainContractRepository.find({
        order: { created_at: "ASC" }, // Ordena pela data para manter o sequencial
    });
    const updatedContracts = [];
    // Objeto para armazenar o último incremento por grupo e ano
    const lastIncrementByGroupYear = {};
    for (const contract of contracts) {
        const { id, product, number_broker, created_at } = contract;
        const year = new Date(created_at).getFullYear().toString().slice(-2);
        const productGroup = getProductGroup(product);
        if (!productGroup) {
            console.warn(`Produto ${product} não pertence a nenhum grupo, ignorando...`);
            continue;
        }
        const key = `${productGroup}-${year}`;
        // Se for o primeiro contrato do grupo no ano, começa do 001
        if (!lastIncrementByGroupYear[key]) {
            lastIncrementByGroupYear[key] = 1;
        }
        else {
            lastIncrementByGroupYear[key] += 1;
        }
        const formattedIncrement = lastIncrementByGroupYear[key]
            .toString()
            .padStart(3, "0");
        const newNumberContract = `${product}.${number_broker}-${formattedIncrement}/${year}`;
        updatedContracts.push({ id, number_contract: newNumberContract });
        console.log(`Contrato atualizado: ${id} -> ${newNumberContract}`);
    }
    // Atualizar os contratos no banco
    for (const { id, number_contract } of updatedContracts) {
        await grainContractRepository.update(id, { number_contract });
    }
    console.log("Correção de contratos concluída!");
    process.exit();
};
fixContractNumbers().catch((error) => {
    console.error("Erro ao corrigir contratos:", error);
    process.exit(1);
});
//# sourceMappingURL=FixContractNumbers.js.map