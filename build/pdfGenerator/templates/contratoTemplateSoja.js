"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var helpers_1 = require("../helpers");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
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
    var seller = data.seller, buyer = data.buyer, number_contract = data.number_contract, product = data.product, number_broker = data.number_broker, quantity = data.quantity, commission_seller = data.commission_seller, commission_buyer = data.commission_buyer, quality = data.quality, price = data.price, type_currency = data.type_currency, complement_destination = data.complement_destination, destination = data.destination, icms = data.icms, payment = data.payment, pickup = data.pickup, pickup_location = data.pickup_location, inspection = data.inspection, observation = data.observation, crop = data.crop, name_product = data.name_product, type_commission_seller = data.type_commission_seller, type_commission_buyer = data.type_commission_buyer, type_pickup = data.type_pickup;
    // Lógica de formatação
    var quantity_aux = modeSave
        ? !quantity.match(/,/g)
            ? quantity.replace(/[.]/g, "")
            : quantity.replace(/[,]/g, ".")
        : quantity;
    var formattedQtd = (0, helpers_1.formatQuantity)(quantity_aux);
    var qtde_extenso = (0, helpers_1.Extenso)(quantity_aux);
    var formattedExtenso = "(".concat(qtde_extenso, ")");
    var formattedSellerCNPJ = (seller === null || seller === void 0 ? void 0 : seller.cnpj_cpf)
        ? (0, helpers_1.insertMaskInCnpj)(seller.cnpj_cpf)
        : "";
    var formattedBuyerCNPJ = (buyer === null || buyer === void 0 ? void 0 : buyer.cnpj_cpf)
        ? (0, helpers_1.insertMaskInCnpj)(buyer.cnpj_cpf)
        : "";
    var formattedCSeller = commission_seller
        ? type_commission_seller === "Percentual"
            ? "".concat(commission_seller, "%")
            : "".concat((0, helpers_1.formatCurrency)(commission_seller, type_currency, true), " por saca,")
        : "";
    var formattedCBuyer = commission_buyer
        ? type_commission_buyer === "Percentual"
            ? "".concat(commission_buyer, "%")
            : "".concat((0, helpers_1.formatCurrency)(commission_buyer, type_currency, true), " por saca,")
        : "";
    var numberContract = number_contract
        ? number_contract
        : "".concat(product, ".").concat(number_broker, "-NNN/").concat(currentYear);
    function formatObservationText(observation) {
        var lines = observation.split("\n");
        return lines
            .map(function (line) {
            if (/^\d+-/.test(line)) {
                return "<span style=\"display:block; margin-left:0;\">".concat(line, "</span>");
            }
            else {
                return "<span style=\"display:block; margin-left:15px;\">".concat(line, "</span>");
            }
        })
            .join("");
    }
    var listProductsForMetricTon = ["O", "F", "OC", "OA", "SB", "EP"];
    var validProductsForMetricTon = listProductsForMetricTon.includes(data.product);
    var formattedSafra = validProductsForMetricTon
        ? " "
        : " - Safra: ".concat(data.crop);
    var formattedMetrica = data.type_quantity === "toneladas métricas"
        ? " toneladas m\u00E9tricas."
        : " quilos.";
    var Dot = data.destination === "Nenhum" && ((_b = data.complement_destination) === null || _b === void 0 ? void 0 : _b.length) === 0
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
        react_1.default.createElement("br", null),
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
        react_1.default.createElement("br", null),
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
        react_1.default.createElement("br", null),
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
                ? "".concat("US").concat((0, helpers_1.formatCurrency)(price, data.type_currency, modeSave))
                : (0, helpers_1.formatCurrency)(price, data.type_currency, modeSave)),
            " ",
            formattedPreco,
            (destination !== "Nenhum" || complement_destination) && (react_1.default.createElement("span", null,
                react_1.default.createElement("strong", null,
                    "(",
                    destination === "Nenhum"
                        ? complement_destination || ""
                        : "".concat(destination).concat(complement_destination ? " ".concat(complement_destination) : ""),
                    ")"),
                "."))),
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
        react_1.default.createElement("div", { style: { textAlign: "justify", whiteSpace: "pre" }, dangerouslySetInnerHTML: {
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