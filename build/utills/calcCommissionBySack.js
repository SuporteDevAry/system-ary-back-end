"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCommissionBySack = void 0;
/**
 * Normaliza número formatado removendo separadores de milhar e convertendo vírgula em ponto
 */
function normalizeNumber(value, preferDecimalDot, options) {
    if (preferDecimalDot === void 0) { preferDecimalDot = true; }
    var raw = String(value).trim();
    if (!raw)
        return Number.NaN;
    var isToneladaMetrica = function (type) {
        if (!type)
            return false;
        var quantityType = normalizeQuantityType(type);
        return (quantityType === "tm" ||
            quantityType === "toneladas" ||
            quantityType === "tonelada" ||
            quantityType === "toneladas metricas");
    };
    if ((options === null || options === void 0 ? void 0 : options.isQuantity) && isToneladaMetrica(options.typeQuantity)) {
        var hasComma = raw.includes(",");
        var hasDot = raw.includes(".");
        if (hasComma && !hasDot) {
            return Number(raw.replace(/\./g, "").replace(",", "."));
        }
        if (hasDot && !hasComma) {
            var parts = raw.split(".");
            // Mais de um ponto: tratar como separador de milhar
            if (parts.length > 2) {
                return Number(raw.replace(/\./g, ""));
            }
            // Um unico ponto: se a parte apos o ponto tem exatamente 3 digitos,
            // e um separador de milhar brasileiro (ex.: "1.000" = 1000 TM).
            // Caso contrario, e decimal (ex.: "2.5" = 2.5 TM).
            var decimalPart = parts[1];
            if (decimalPart.length === 3) {
                return Number(raw.replace(/\./g, ""));
            }
            return Number(raw);
        }
    }
    // Se tem vírgula, assume formato brasileiro: 1.000,50 ou 5,000
    if (raw.includes(",")) {
        return Number(raw.replace(/\./g, "").replace(",", "."));
    }
    // Se tem ponto, depende do contexto
    if (raw.includes(".")) {
        // Se preferir decimal (preço, taxa), mantém o ponto: "5.000" = 5.0
        // Se não preferir (quantidade), remove o ponto: "1.000" = 1000
        return preferDecimalDot ? Number(raw) : Number(raw.replace(/\./g, ""));
    }
    return Number(raw);
}
function normalizeQuantityType(type) {
    return String(type || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
/**
 * Calcula a comissão baseada no tipo de comissão, moeda e quantidade
 *
 * @param quantity - Quantidade do contrato
 * @param typeQuantity - Tipo da quantidade ("KG" ou "TM" para toneladas métricas)
 * @param commissionValue - Valor da comissão
 * @param typeCommission - Tipo de comissão ("Fixo", "Percentual", "Por Saca", "Por TM")
 * @param typeCurrency - Tipo de moeda ("BRL" ou "USD"/"Dólar")
 * @param exchangeRate - Taxa de câmbio (usado quando typeCurrency é "USD"/"Dólar")
 * @param totalContractValue - Valor total do contrato (usado para "Percentual")
 * @returns Valor total da comissão calculada
 */
function calcCommissionBySack(quantity, typeQuantity, commissionValue, typeCommission, typeCurrency, exchangeRate, totalContractValue) {
    var quantityNum = normalizeNumber(quantity, false, {
        isQuantity: true,
        typeQuantity: typeQuantity,
    });
    var commissionNum = normalizeNumber(commissionValue, true); // comissão: dot = decimal
    // Normaliza exchange rate se fornecido
    var normalizedExchangeRate = exchangeRate
        ? normalizeNumber(exchangeRate, true) // exchange rate: dot = decimal
        : 1;
    // Normaliza total do contrato se fornecido
    var normalizedTotalContract = totalContractValue
        ? normalizeNumber(totalContractValue, true)
        : 0;
    var isDollar = typeCurrency === "USD" ||
        typeCurrency === "US$" ||
        typeCurrency === "Dólar";
    var quantityType = normalizeQuantityType(typeQuantity || "KG");
    // REGRA 1: Fixo em Dólar - comissão_valor × exchange_rate
    // Ex.: 1,25 × 5,000 = 6,25
    if (typeCommission === "Fixo" && isDollar) {
        return commissionNum * normalizedExchangeRate;
    }
    // REGRA 2: Fixo em Reais - apenas o valor da comissão
    if (typeCommission === "Fixo" && !isDollar) {
        return commissionNum;
    }
    // REGRA 3: Percentual (Valor fixo) - (valor_total_contrato × comissão%) / 100
    // Ex.: R$ 3.000.000 × 0,50% / 100 = R$ 15.000
    if (typeCommission === "Percentual") {
        return (normalizedTotalContract * commissionNum) / 100;
    }
    // REGRA 4 e 5: Por Saca
    if (typeCommission === "Por Saca") {
        var sacas = 0;
        // Calcula quantidade em sacas baseado no tipo de quantidade
        if (quantityType === "kg" ||
            quantityType === "quilos" ||
            quantityType === "kg") {
            // Quilos / 60 = número de sacas
            sacas = quantityNum / 60;
        }
        else if (quantityType === "tm" ||
            quantityType === "toneladas" ||
            quantityType === "tonelada") {
            // Toneladas métricas * 1000 / 60 = número de sacas
            sacas = (quantityNum * 1000) / 60;
        }
        // REGRA 4: Em Dólar por saca - (quantidade / 60) × comissão_US$ × exchange_rate
        // Ex.: (10.00 / 60) × US$ 0,20 × 5,000 = ...
        if (isDollar) {
            return sacas * commissionNum * normalizedExchangeRate;
        }
        // REGRA 5: Em Reais por saca - (quantidade / 60) × comissão_R$
        // Ex.: (10.00 / 60) × R$ 10,00 = R$ 1.666,67
        return sacas * commissionNum;
    }
    // REGRA 6 e 7: Por TM (tonelada metrica)
    if (typeCommission === "Por TM") {
        var isQuantityInKg = quantityType === "kg" ||
            quantityType === "quilos" ||
            quantityType === "quilo";
        // Se a quantidade vier em KG, converte para TM; caso contrario assume TM.
        var toneladasMetricas = isQuantityInKg ? quantityNum / 1000 : quantityNum;
        // Regra explicita: quantidade x (valor da comissao x cambio da comissao)
        var commissionPerTm = isDollar
            ? commissionNum * normalizedExchangeRate
            : commissionNum;
        return toneladasMetricas * commissionPerTm;
    }
    return 0;
}
exports.calcCommissionBySack = calcCommissionBySack;
//# sourceMappingURL=calcCommissionBySack.js.map