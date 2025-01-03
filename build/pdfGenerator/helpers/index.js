"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQuantity = exports.formatDateWithLongMonth = exports.insertMaskInCnpj = exports.Extenso = exports.formatCurrency = void 0;
var formatCurrency = function (value, currency, modeSave) {
    var numberValue = parseFloat(value);
    if (modeSave) {
        numberValue = parseFloat(value.replace(/[^\d,-]/g, "").replace(",", "."));
    }
    var locale = currency === "Real" ? "pt-BR" : "en-US";
    if (isNaN(numberValue)) {
        return "";
    }
    var typeCurrency = currency === "Dólar" ? "USD" : "BRL";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: typeCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numberValue);
};
exports.formatCurrency = formatCurrency;
function Extenso(vlr) {
    if (vlr === 0)
        return "zero";
    var unidades = [
        "",
        "um",
        "dois",
        "três",
        "quatro",
        "cinco",
        "seis",
        "sete",
        "oito",
        "nove",
    ];
    var especiais = [
        "dez",
        "onze",
        "doze",
        "treze",
        "quatorze",
        "quinze",
        "dezesseis",
        "dezessete",
        "dezoito",
        "dezenove",
    ];
    var dezenas = [
        "",
        "",
        "vinte",
        "trinta",
        "quarenta",
        "cinquenta",
        "sessenta",
        "setenta",
        "oitenta",
        "noventa",
    ];
    var centenas = [
        "",
        "cento",
        "duzentos",
        "trezentos",
        "quatrocentos",
        "quinhentos",
        "seiscentos",
        "setecentos",
        "oitocentos",
        "novecentos",
    ];
    var extenso = "";
    var milhoes = Math.floor(vlr / 1000000);
    var milhar = Math.floor((vlr % 1000000) / 1000);
    var centena = Math.floor((vlr % 1000) / 100);
    var dezena = Math.floor((vlr % 100) / 10);
    var unidade = vlr % 10;
    if (milhoes > 0) {
        if (milhoes === 1) {
            extenso += "um milhão";
        }
        else {
            extenso += Extenso(milhoes) + " milhões";
        }
        if (milhar > 0 || centena > 0 || dezena > 0 || unidade > 0)
            extenso += ", ";
    }
    if (milhar > 0) {
        if (milhar === 1) {
            extenso += "mil";
        }
        else {
            extenso += Extenso(milhar) + " mil";
        }
        if (centena > 0 || dezena > 0 || unidade > 0)
            extenso += " e ";
    }
    if (centena > 0) {
        if (centena === 1 && dezena === 0 && unidade === 0) {
            extenso += "cem";
        }
        else {
            extenso += centenas[centena];
        }
        if (dezena > 0 || unidade > 0)
            extenso += " e ";
    }
    if (dezena > 1) {
        extenso += dezenas[dezena];
        if (unidade > 0)
            extenso += " e " + unidades[unidade];
    }
    else if (dezena === 1) {
        extenso += especiais[unidade];
    }
    else if (unidade > 0) {
        extenso += unidades[unidade];
    }
    return extenso.trim();
}
exports.Extenso = Extenso;
var insertMaskInCnpj = function (cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
};
exports.insertMaskInCnpj = insertMaskInCnpj;
var formatDateWithLongMonth = function (dateString) {
    var months = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
    ];
    // Separar dia, mês e ano da data fornecida (formato DD/MM/YYYY)
    var _a = dateString.split("/"), day = _a[0], month = _a[1], year = _a[2];
    // Obter o nome do mês a partir do índice (mês - 1 porque os meses são baseados em zero)
    var monthName = months[parseInt(month) - 1];
    // Retornar a data no formato desejado
    return "".concat(day, " de ").concat(monthName, " de ").concat(year);
};
exports.formatDateWithLongMonth = formatDateWithLongMonth;
var formatQuantity = function (value) {
    var numericValue = value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona o separador de milhares
};
exports.formatQuantity = formatQuantity;
//# sourceMappingURL=index.js.map