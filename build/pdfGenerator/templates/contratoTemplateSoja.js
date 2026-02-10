"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var Extenso_1 = require("../helpers/Extenso");
var logoContrato = path_1.default.resolve(__dirname, "../helpers/Logo_Ary_Completo.jpg");
var logoBase64 = "data:image/jpeg;base64,".concat(fs_1.default
    .readFileSync(logoContrato)
    .toString("base64"));
var ContratoTemplateSoja = function (_a) {
    var _b, _c, _d;
    var data = _a.data, typeContract = _a.typeContract, modeSave = _a.modeSave;
    var today = new Date();
    var currentYear = today.getFullYear().toString().substr(-2);
    // Verifique se data é válida e contém as propriedades necessárias
    if (!data || Object.keys(data).length === 0) {
        return react_1.default.createElement("div", null, "Erro: Dados do contrato n\u00E3o encontrados.");
    }
    // Extraindo as propriedades necessárias de data
    var seller = data.seller, buyer = data.buyer, number_contract = data.number_contract, product = data.product, number_broker = data.number_broker, quantity = data.quantity, commission_seller = data.commission_seller, commission_buyer = data.commission_buyer, commission_seller_contract_value = data.commission_seller_contract_value, commission_buyer_contract_value = data.commission_buyer_contract_value, quality = data.quality, price = data.price, type_currency = data.type_currency, complement_destination = data.complement_destination, destination = data.destination, icms = data.icms, payment = data.payment, pickup = data.pickup, pickup_location = data.pickup_location, inspection = data.inspection, observation = data.observation, type_quantity = data.type_quantity, name_product = data.name_product, type_commission_seller = data.type_commission_seller, type_commission_buyer = data.type_commission_buyer, type_commission_seller_currency = data.type_commission_seller_currency, type_commission_buyer_currency = data.type_commission_buyer_currency, type_pickup = data.type_pickup;
    var quantityValue = typeof quantity === "number" ? quantity : (0, helpers_1.parseQuantityToNumber)(quantity);
    var formattedQtd = (0, helpers_1.numberToQuantityString)(quantity);
    // montar extenso dependendo do tipo de quantidade
    var formattedExtenso = "";
    if (type_quantity === "toneladas métricas") {
        // tratar como toneladas métricas: parte inteira = toneladas, parte decimal = quilos (3 casas decimais)
        var raw = String(formattedQtd)
            .trim()
            .replace(/\./g, "")
            .replace(/,/g, ".");
        var parts = raw.split(".");
        var inteiro = Number(parts[0]) || 0;
        var decimais = parts[1] ? parts[1].padEnd(3, "0").slice(0, 3) : ""; // gramas/quilos em 3 dígitos
        var toneladasText = inteiro > 0
            ? (0, Extenso_1.Extenso)(inteiro, "F") +
                (inteiro === 1 ? " tonelada métrica" : " toneladas métricas")
            : "";
        var kilosFromDecimals = decimais ? Number(decimais) : 0;
        var kilosText = kilosFromDecimals > 0
            ? (0, Extenso_1.Extenso)(kilosFromDecimals, "M") +
                (kilosFromDecimals === 1 ? " quilo" : " quilos")
            : "";
        var combined = [toneladasText, kilosText].filter(Boolean).join(" e ");
        formattedExtenso = combined ? "(".concat(combined, ")") : "";
    }
    else {
        // tratar como quilos (masculino)
        var inteiro = Math.round(quantityValue);
        var ext = (0, Extenso_1.Extenso)(inteiro, "M");
        formattedExtenso = "(".concat(ext, ")");
    }
    var formattedSellerCNPJ = (seller === null || seller === void 0 ? void 0 : seller.cnpj_cpf)
        ? (0, helpers_1.insertMaskInCnpj)(seller.cnpj_cpf)
        : "";
    var formattedBuyerCNPJ = (buyer === null || buyer === void 0 ? void 0 : buyer.cnpj_cpf)
        ? (0, helpers_1.insertMaskInCnpj)(buyer.cnpj_cpf)
        : "";
    // DEBUG: Log dos valores de comissão recebidos
    console.log("[PDF Template] Comissões recebidas:", {
        commission_seller: commission_seller,
        commission_seller_contract_value: commission_seller_contract_value,
        type_commission_seller: type_commission_seller,
        type_commission_seller_currency: type_commission_seller_currency,
        commission_buyer: commission_buyer,
        commission_buyer_contract_value: commission_buyer_contract_value,
        type_commission_buyer: type_commission_buyer,
        type_commission_buyer_currency: type_commission_buyer_currency,
    });
    // Formatação da comissão do vendedor
    var formattedCSeller = "";
    if (commission_seller) {
        if (type_commission_seller === "Percentual") {
            // Percentual: mostra o valor percentual
            formattedCSeller = "".concat(commission_seller, "%");
        }
        else if (commission_seller_contract_value) {
            // Fixo ou Por Saca: usa o valor calculado do back-end (já convertido para BRL)
            var valueInBRL = typeof commission_seller_contract_value === "number"
                ? commission_seller_contract_value.toFixed(2).replace(".", ",")
                : String(commission_seller_contract_value).replace(".", ",");
            formattedCSeller = "R$ ".concat(valueInBRL);
            console.log("[PDF Template] Vendedor - Usando contract_value:", valueInBRL);
        }
        else {
            // Fallback: usa o valor original (apenas para casos antigos sem cálculo)
            formattedCSeller = (0, helpers_1.formatCurrency)(commission_seller, "Real", true);
            console.log("[PDF Template] Vendedor - Usando fallback:", formattedCSeller);
        }
    }
    // Formatação da comissão do comprador
    var formattedCBuyer = "";
    if (commission_buyer) {
        if (type_commission_buyer === "Percentual") {
            // Percentual: mostra o valor percentual
            formattedCBuyer = "".concat(commission_buyer, "%");
        }
        else if (commission_buyer_contract_value) {
            // Fixo ou Por Saca: usa o valor calculado do back-end (já convertido para BRL)
            var valueInBRL = typeof commission_buyer_contract_value === "number"
                ? commission_buyer_contract_value.toFixed(2).replace(".", ",")
                : String(commission_buyer_contract_value).replace(".", ",");
            formattedCBuyer = "R$ ".concat(valueInBRL);
            console.log("[PDF Template] Comprador - Usando contract_value:", valueInBRL);
        }
        else {
            // Fallback: usa o valor original (apenas para casos antigos sem cálculo)
            formattedCBuyer = (0, helpers_1.formatCurrency)(commission_buyer, "Real", true);
            console.log("[PDF Template] Comprador - Usando fallback:", formattedCBuyer);
        }
    }
    var numberContract = number_contract
        ? number_contract
        : "".concat(product, ".").concat(number_broker, "-NNN/").concat(currentYear);
    // function formatObservationText(observation: string) {
    //   const lines = observation.split("\n");
    //   return lines
    //     .map((line) => {
    //       if (/^\d+-/.test(line)) {
    //         return `<span style="display:block; margin-left:0;">${line}</span>`;
    //       } else {
    //         return `<span style="display:block; margin-left:15px;">${line}</span>`;
    //       }
    //     })
    //     .join("");
    // }
    function formatObservationText(observation) {
        if (!observation) {
            return "";
        }
        // Divide e remove linhas vazias
        var lines = observation
            .split("\n")
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line !== ""; });
        var hasMultipleLines = lines.length > 1;
        var formattedLines = lines.map(function (line) {
            // Se a linha começar com número seguido de hífen (ex: 1-, 2-)
            if (/^\d+-/.test(line)) {
                return "<div style=\"margin-left: 0; line-height: 1.2;\">".concat(line, "</div>");
            }
            else if (hasMultipleLines) {
                // Adiciona leve indentação para linhas subsequentes
                return "<div style=\"margin-left: 20px; line-height: 1.2;\">".concat(line, "</div>");
            }
            else {
                return "<div style=\"line-height: 1.2;\">".concat(line, "</div>");
            }
        });
        return formattedLines.join("");
    }
    var listProductsForMetricTon = ["O", "F", "OC", "OA", "SB", "EP"];
    var validProductsForMetricTon = listProductsForMetricTon.includes(data.product);
    var formattedSafra = validProductsForMetricTon
        ? " "
        : " - Safra: ".concat(data.crop);
    var formattedMetrica = data.type_quantity === "toneladas métricas" ? "." : " quilos.";
    var Dot = data.destination === "Nenhum" ||
        (data.destination === "" && ((_b = data.complement_destination) === null || _b === void 0 ? void 0 : _b.length) === 0)
        ? "."
        : ", ";
    var formattedPreco = data.type_quantity === "toneladas métricas"
        ? " por tonelada m\u00E9trica".concat(Dot)
        : " por saca de 60(sessenta) quilos".concat(Dot);
    var formattedComplementSeller = ((_c = data.seller) === null || _c === void 0 ? void 0 : _c.complement)
        ? "".concat(" - ", " ").concat(data.seller.complement, " ")
        : "";
    var formattedComplementBuyer = ((_d = data.buyer) === null || _d === void 0 ? void 0 : _d.complement)
        ? "".concat(" - ", " ").concat(data.buyer.complement, " ")
        : "";
    return (react_1.default.createElement("div", { id: "contrato" },
        react_1.default.createElement("div", { style: { margin: 0, textAlign: "center" } },
            react_1.default.createElement("img", { src: logoBase64, alt: "logo Ary Completo", width: 300 })),
        react_1.default.createElement("h3", null,
            react_1.default.createElement("div", { style: { paddingLeft: "250px" } },
                "S\u00E3o Paulo,",
                " ",
                react_1.default.createElement("span", null, (0, helpers_1.formatDateWithLongMonth)(data.contract_emission_date))),
            react_1.default.createElement("div", { style: { paddingLeft: "250px" } },
                "Confirma\u00E7\u00E3o de negocia\u00E7\u00E3o ",
                react_1.default.createElement("span", null,
                    " ",
                    numberContract,
                    " "))),
        react_1.default.createElement("div", { style: { display: "table", width: "100%", marginBottom: "20px" } },
            react_1.default.createElement("div", { style: { display: "table-row" } },
                react_1.default.createElement("div", { style: {
                        display: "table-cell",
                        fontWeight: "bold",
                        width: "110px",
                        verticalAlign: "top",
                    } }, "VENDEDOR:"),
                react_1.default.createElement("div", { style: { display: "table-cell" } },
                    react_1.default.createElement("div", null, seller.name),
                    react_1.default.createElement("div", null,
                        seller.address,
                        ", ",
                        seller.number,
                        " ",
                        formattedComplementSeller,
                        " -",
                        " ",
                        seller.district),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("strong", null,
                            seller.city,
                            " - ",
                            seller.state)),
                    react_1.default.createElement("div", null,
                        "CNPJ: ",
                        formattedSellerCNPJ,
                        " \u00A0\u00A0 Inscr.Est.:",
                        " ",
                        seller.ins_est)))),
        react_1.default.createElement("div", { style: { display: "table", width: "100%", marginBottom: "20px" } },
            react_1.default.createElement("div", { style: { display: "table-row" } },
                react_1.default.createElement("div", { style: {
                        display: "table-cell",
                        fontWeight: "bold",
                        width: "110px",
                        verticalAlign: "top",
                    } }, "COMPRADOR:"),
                react_1.default.createElement("div", { style: { display: "table-cell" } },
                    react_1.default.createElement("div", null, buyer.name),
                    react_1.default.createElement("div", null,
                        buyer.address,
                        ", ",
                        buyer.number,
                        " ",
                        formattedComplementBuyer,
                        " -",
                        " ",
                        buyer.district),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("strong", null,
                            buyer.city,
                            " - ",
                            buyer.state)),
                    react_1.default.createElement("div", null,
                        "CNPJ: ",
                        formattedBuyerCNPJ,
                        " \u00A0\u00A0 Inscr.Est.:",
                        " ",
                        buyer.ins_est)))),
        react_1.default.createElement("div", { style: { textAlign: "left", margin: "0" } },
            react_1.default.createElement("strong", null, "Mercadoria:"),
            react_1.default.createElement("div", { style: { textAlign: "left" } },
                react_1.default.createElement("span", null, name_product),
                react_1.default.createElement("span", null,
                    react_1.default.createElement("strong", null,
                        react_1.default.createElement("span", null, formattedSafra))))),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "Qualidade:")),
        react_1.default.createElement("div", { style: { textAlign: "left", whiteSpace: "pre-line" } }, quality),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "Quantidade:")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } },
            react_1.default.createElement("strong", null,
                formattedQtd,
                " ",
                formattedExtenso),
            " ",
            formattedMetrica),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "Pre\u00E7o:")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } },
            react_1.default.createElement("strong", null, data.type_currency === "Dólar"
                ? "".concat((0, helpers_1.formatCurrency)(price, data.type_currency, modeSave).replace("$", "US$ "))
                : (0, helpers_1.formatCurrency)(price, data.type_currency, modeSave)),
            " ",
            formattedPreco,
            (destination && destination !== "Nenhum") || complement_destination ? (react_1.default.createElement("span", null,
                react_1.default.createElement("strong", null,
                    "(",
                    [
                        destination !== "Nenhum" ? destination : "",
                        complement_destination,
                    ]
                        .filter(Boolean)
                        .join(" "),
                    ")"),
                ".")) : null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "ICMS:")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } }, icms),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "Pagamento:")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } }, payment),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null,
                type_pickup,
                ":")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } }, pickup),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null,
                "Local de ",
                type_pickup,
                ":")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } }, pickup_location),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "Confer\u00EAncia:")),
        react_1.default.createElement("div", { style: { textAlign: "justify" } }, inspection),
        react_1.default.createElement("br", null),
        observation && (react_1.default.createElement("div", { style: { textAlign: "left" } },
            react_1.default.createElement("strong", null, "Observa\u00E7\u00F5es:"))),
        react_1.default.createElement("div", { style: { textAlign: "justify", whiteSpace: "pre-line" }, dangerouslySetInnerHTML: {
                __html: formatObservationText(observation),
            } }),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { textAlign: "justify" } },
            react_1.default.createElement("strong", null, "\"Favor comunicar qualquer discrep\u00E2ncia em 01 (um) dia \u00FAtil do recebimento da confirma\u00E7\u00E3o por escrito. Se n\u00E3o houver discrep\u00E2ncias relatadas, presume-se que todas as partes envolvidas aceitam e concordam com todos os termos conforme descrito na confirma\u00E7\u00E3o de neg\u00F3cio acima.\"")),
        react_1.default.createElement("br", null),
        typeContract === "Vendedor" && formattedCSeller ? (react_1.default.createElement("div", { style: { textAlign: "justify" } },
            react_1.default.createElement("strong", null, "==="),
            react_1.default.createElement("br", null),
            react_1.default.createElement("strong", null,
                "Comiss\u00E3o de ",
                react_1.default.createElement("span", null, formattedCSeller.replace(".", ",")),
                "  ",
                "por conta do vendedor."),
            react_1.default.createElement("br", null),
            react_1.default.createElement("strong", null, "==="))) : (""),
        typeContract === "Comprador" && formattedCBuyer ? (react_1.default.createElement("div", { style: { textAlign: "justify" } },
            react_1.default.createElement("strong", null, "==="),
            react_1.default.createElement("br", null),
            react_1.default.createElement("strong", null,
                "Comiss\u00E3o de ",
                react_1.default.createElement("span", null, formattedCBuyer.replace(".", ",")),
                "  ",
                "por conta do comprador."),
            react_1.default.createElement("br", null),
            react_1.default.createElement("strong", null, "==="))) : (""),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("div", { style: { display: "flex", flexDirection: "column" } },
            react_1.default.createElement("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    textAlign: "center",
                } },
                react_1.default.createElement("div", { style: { flex: "1" } }, "______________________________________"),
                react_1.default.createElement("div", { style: { flex: "1" } }, "_____________________________________")),
            react_1.default.createElement("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    textAlign: "center",
                } },
                react_1.default.createElement("div", { style: { flex: "1" } },
                    react_1.default.createElement("strong", null, "VENDEDOR")),
                react_1.default.createElement("div", { style: { flex: "1" } },
                    react_1.default.createElement("strong", null, "COMPRADOR"))))));
};
exports.default = ContratoTemplateSoja;
//# sourceMappingURL=contratoTemplateSoja.js.map