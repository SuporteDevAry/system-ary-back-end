"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToQuantityString = exports.formatQuantityWithDecimal = exports.parseQuantityToNumber = exports.formatQuantity = exports.formatDateWithLongMonth = exports.insertMaskInCnpj = exports.formatCurrency = void 0;
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
var parseQuantityToNumber = function (value) {
    if (!value)
        return 0;
    var cleanValue = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanValue) || 0;
};
exports.parseQuantityToNumber = parseQuantityToNumber;
var formatQuantityWithDecimal = function (value) {
    if (!value)
        return "";
    var cleanValue = value.replace(/[^\d,]/g, "");
    var parts = cleanValue.split(",");
    if (parts.length > 2) {
        cleanValue = parts[0] + "," + parts.slice(1).join("");
    }
    if (parts.length === 2) {
        var integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        var decimalPart = parts[1].slice(0, 3);
        return "".concat(integerPart, ",").concat(decimalPart);
    }
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
exports.formatQuantityWithDecimal = formatQuantityWithDecimal;
var numberToQuantityString = function (value) {
    if (!value && value !== 0)
        return "";
    var numValue;
    if (typeof value === "string") {
        if (value.includes(",")) {
            numValue = (0, exports.parseQuantityToNumber)(value);
        }
        else {
            numValue = parseFloat(value);
        }
    }
    else {
        numValue = value;
    }
    if (isNaN(numValue))
        return "";
    var integerPart = Math.floor(numValue);
    var decimalPart = numValue - integerPart;
    if (decimalPart === 0) {
        return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    var formattedDecimal = decimalPart.toFixed(3).substring(2);
    var stringValue = "".concat(integerPart, ",").concat(formattedDecimal);
    return (0, exports.formatQuantityWithDecimal)(stringValue);
};
exports.numberToQuantityString = numberToQuantityString;
//# sourceMappingURL=index.js.map