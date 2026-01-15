"use strict";
/**
 * Integração com API Focus NFe para envio de NFS-e
 * Documentação: https://doc.focusnfe.com.br/reference/enviarnfse
 *
 * Permite enviar NFS-e para prefeitura via serviço terceirizado
 * Mantém os mesmos métodos que NfseSpService para compatibilidade
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusNfeService = void 0;
var https_1 = __importDefault(require("https"));
var xml2js_1 = require("xml2js");
var FocusNfeService = /** @class */ (function () {
    function FocusNfeService() {
        this.config = {
            apiUrl: process.env.FOCUS_NFE_API_URL || "https://api.focusnfe.com.br/v2",
            apiToken: process.env.FOCUS_NFE_API_TOKEN || "",
            timeout: 30000,
        };
        if (!this.config.apiToken) {
            throw new Error("FOCUS_NFE_API_TOKEN não configurado. Configure a variável de ambiente.");
        }
        console.log("✅ FocusNfeService inicializado");
        console.log("   API URL: ".concat(this.config.apiUrl));
        console.log("   Token configurado: ".concat(this.config.apiToken.substring(0, 5), "...").concat(this.config.apiToken.substring(this.config.apiToken.length - 5)));
        // Detectar se está em homologação
        var isHomolog = this.config.apiUrl.includes("homologacao");
        console.log("   Ambiente: ".concat(isHomolog ? "HOMOLOGAÇÃO" : "PRODUÇÃO"));
    }
    /**
     * Envia lote de RPS via API Focus NFe
     * Aceita XML gerado pelo frontend e o processa
     */
    FocusNfeService.prototype.enviarLoteRps = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
            var focusRequest, referencia, _a, _ref, body, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log("📤 Processando XML para envio Focus NFe...");
                        return [4 /*yield*/, this.converterXmlParaFocusNfe(xml)];
                    case 1:
                        focusRequest = _b.sent();
                        console.log("✅ XML convertido para formato Focus NFe");
                        referencia = focusRequest.referencia;
                        _a = focusRequest, _ref = _a.referencia, body = __rest(_a, ["referencia"]);
                        return [4 /*yield*/, this.fazerRequisicaoApi("POST", "/nfse?ref=".concat(referencia), body)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        error_1 = _b.sent();
                        console.error("❌ Erro ao enviar para Focus NFe:", error_1);
                        throw new Error("Falha no envio: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Consulta status de NFS-e na Focus NFe
     */
    FocusNfeService.prototype.consultarLote = function (numeroProtocolo) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\uD83D\uDD0D Consultando NFS-e ".concat(numeroProtocolo, " na Focus NFe..."));
                        return [4 /*yield*/, this.fazerRequisicaoApi("GET", "/nfse/".concat(numeroProtocolo))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.error("❌ Erro ao consultar Focus NFe:", error_2);
                        throw new Error("Falha na consulta: ".concat(error_2.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancela NFS-e na Focus NFe
     */
    FocusNfeService.prototype.cancelarNfse = function (numeroNfse, motivo) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\u274C Cancelando NFS-e ".concat(numeroNfse, " na Focus NFe..."));
                        payload = {
                            pedido_numero_nfse: numeroNfse,
                            motivo_cancelamento: motivo,
                        };
                        return [4 /*yield*/, this.fazerRequisicaoApi("POST", "/nfse/".concat(numeroNfse, "/cancelamento"), payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.error("❌ Erro ao cancelar NFS-e na Focus NFe:", error_3);
                        throw new Error("Falha no cancelamento: ".concat(error_3.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Faz requisição genérica para a API Focus NFe
     */
    FocusNfeService.prototype.fazerRequisicaoApi = function (method, endpoint, payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = new URL(_this.config.apiUrl + endpoint);
            console.log("\n\uD83D\uDD17 Requisi\u00E7\u00E3o Focus NFe:");
            console.log("   M\u00E9todo: ".concat(method));
            console.log("   URL: ".concat(url.hostname).concat(url.pathname).concat(url.search));
            // Tenta HTTP Basic Auth: base64(token:)
            var auth = Buffer.from("".concat(_this.config.apiToken, ":")).toString("base64");
            console.log("   Auth: Basic ".concat(auth.substring(0, 10), "..."));
            var options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Basic ".concat(auth),
                },
                timeout: _this.config.timeout,
            };
            var req = https_1.default.request(options, function (res) {
                var data = "";
                res.on("data", function (chunk) {
                    data += chunk;
                });
                res.on("end", function () {
                    // DEBUG: Log do payload enviado para diagnóstico
                    if (payload) {
                        console.log("\n🔍 DEBUG - Payload EXATO enviado no corpo da requisição:");
                        console.log(JSON.stringify(payload, null, 2));
                    }
                    console.log("\n\u2705 Resposta Focus NFe (".concat(res.statusCode, "):"));
                    // Se status é 401, mensagem de erro de autenticação
                    if (res.statusCode === 401) {
                        console.error("❌ ERRO DE AUTENTICAÇÃO 401:");
                        console.error("   Token pode estar expirado ou inválido");
                        console.error("   Verifique em: https://app.focusnfe.com.br -> Conta -> Integrações -> API");
                        console.error("   Resposta recebida:", data);
                        reject(new Error("Autenticação falhou (401). Verifique o token FOCUS_NFE_API_TOKEN."));
                        return;
                    }
                    try {
                        var response = JSON.parse(data);
                        console.log(JSON.stringify(response, null, 2));
                        if (res.statusCode &&
                            res.statusCode >= 200 &&
                            res.statusCode < 300) {
                            resolve(response);
                        }
                        else {
                            reject(new Error("API Error ".concat(res.statusCode, ": ").concat(response.mensagem || response.message || "Unknown error")));
                        }
                    }
                    catch (e) {
                        reject(new Error("Erro ao parsear resposta: ".concat(data)));
                    }
                });
            });
            req.on("error", function (error) {
                reject(error);
            });
            req.on("timeout", function () {
                req.destroy();
                reject(new Error("Timeout na requisição Focus NFe"));
            });
            if (payload) {
                req.write(JSON.stringify(payload));
            }
            req.end();
        });
    };
    /**
     * Converte XML do padrão Prefeitura SP para o formato esperado pela Focus NFe
     * XML de entrada: <PedidoEnvioLoteRPS> com um ou mais <RPS>
     * Saída: FocusNfeRequest com formato específico da API
     */
    FocusNfeService.prototype.converterXmlParaFocusNfe = function (xml) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        (0, xml2js_1.parseString)(xml, { explicitArray: false }, function (err, result) {
                            if (err) {
                                reject(new Error("Erro ao parsear XML: ".concat(err.message)));
                                return;
                            }
                            try {
                                var pedido = result.PedidoEnvioLoteRPS;
                                var cabecalho = pedido.Cabecalho || {};
                                // Extrai dados do prestador
                                var rpsArray = Array.isArray(pedido.RPS)
                                    ? pedido.RPS
                                    : [pedido.RPS];
                                var primeiroRps = rpsArray[0];
                                // DEBUG: Log completo da estrutura do primeiro RPS
                                console.log("🔍 DEBUG - Estrutura completa do RPS recebida:");
                                console.log(JSON.stringify(primeiroRps, null, 2));
                                // InscricaoPrestador está dentro de ChaveRPS no XML
                                var chaveRps = primeiroRps.ChaveRPS || {};
                                var inscricaoPrestador = chaveRps.InscricaoPrestador || primeiroRps.InscricaoPrestador || "";
                                // Extrai CNPJ/CPF do prestador a partir do Cabecalho (onde o frontend envia)
                                var cpfCnpjRemetente = cabecalho.CPFCNPJRemetente || {};
                                var cnpjPrestador = cpfCnpjRemetente.CNPJ ||
                                    primeiroRps.CNPJRemetente ||
                                    primeiroRps.CNPJ ||
                                    process.env.CNPJ_PRESTADOR ||
                                    "";
                                var cpfPrestador = cpfCnpjRemetente.CPF ||
                                    primeiroRps.CPFRemetente ||
                                    primeiroRps.CPF ||
                                    process.env.CPF_PRESTADOR ||
                                    "";
                                // Log para debug
                                console.log("   \uD83D\uDCCB Extra\u00E7\u00E3o Prestador:");
                                console.log("      IM: ".concat(inscricaoPrestador || "✗ não encontrado"));
                                console.log("      CNPJ: ".concat(cnpjPrestador ? "✓ fornecido" : "✗ não fornecido"));
                                console.log("      CPF: ".concat(cpfPrestador ? "✓ fornecido" : "✗ não fornecido"));
                                // Extrai dados do tomador a partir do primeiro RPS
                                var rps = primeiroRps;
                                var cpfCnpjTomador = rps.CPFCNPJTomador || {};
                                var enderecTomador = rps.EnderecoTomador || {};
                                var cnpjTomador = cpfCnpjTomador.CNPJ || "";
                                var cpfTomador = cpfCnpjTomador.CPF || "";
                                var razaoSocialTomador = rps.RazaoSocialTomador || rps.NomeFantasia || "Cliente";
                                var emailTomador = rps.EmailTomador || "";
                                var codigoMunicipioServico = rps.MunicipioPrestacao || "3550308";
                                var codigoMunicipioTomadorOriginal = enderecTomador.Cidade || codigoMunicipioServico;
                                var codigoMunicipioTomadorCorrigido = _this.validarECorrigirCodigoMunicipio(codigoMunicipioTomadorOriginal, enderecTomador.UF || "SP", enderecTomador.CEP || "");
                                var valorServicos = parseFloat(rps.ValorServicos) || 0;
                                var aliquotaFracao = parseFloat(rps.AliquotaServicos) || 0;
                                var aliquotaPercentual = Math.round(aliquotaFracao * 100 * 100) / 100;
                                var valorIss = valorServicos * aliquotaFracao;
                                // Monta a requisição final
                                var prestadorObj = {
                                    inscricao_municipal: inscricaoPrestador,
                                    codigo_municipio: String("3550308"),
                                };
                                // Apenas inclui cnpj/cpf se tiverem valores
                                if (cnpjPrestador.trim()) {
                                    prestadorObj.cnpj = cnpjPrestador;
                                }
                                if (cpfPrestador.trim()) {
                                    prestadorObj.cpf = cpfPrestador;
                                }
                                // Validação: precisa de pelo menos um (cnpj ou cpf)
                                if (!prestadorObj.cnpj && !prestadorObj.cpf) {
                                    throw new Error("Prestador sem CNPJ nem CPF. Configure CNPJ_PRESTADOR ou CPF_PRESTADOR em .env");
                                }
                                // Define cTribMun (3 dígitos) via env override quando disponível
                                var codigoTribMun = _this.deriveCodigoTributarioMunicipio();
                                var focusRequest = {
                                    referencia: "LOTE-".concat(Date.now()),
                                    data_emissao: _this.formatarData(rps.DataEmissao),
                                    prestador: __assign(__assign(__assign({}, (cnpjPrestador && { cnpj: cnpjPrestador })), (cpfPrestador && { cpf: cpfPrestador })), { inscricao_municipal: inscricaoPrestador, codigo_municipio: String("3550308") }),
                                    tomador: __assign(__assign(__assign(__assign(__assign({}, (cnpjTomador && { cnpj: cnpjTomador })), (cpfTomador && { cpf: cpfTomador })), { razao_social: razaoSocialTomador }), (emailTomador && { email: emailTomador })), { endereco: __assign(__assign({ logradouro: enderecTomador.Logradouro || "", numero: enderecTomador.NumeroEndereco || "S/N" }, (enderecTomador.ComplementoEndereco && {
                                            complemento: enderecTomador.ComplementoEndereco,
                                        })), { bairro: enderecTomador.Bairro || "", codigo_municipio: String(codigoMunicipioTomadorCorrigido), uf: enderecTomador.UF || "SP", cep: _this.formatarCEP(enderecTomador.CEP) }) }),
                                    servico: __assign(__assign(__assign(__assign({ valor_servicos: valorServicos }, (parseFloat(rps.ValorDeducoes) > 0 && {
                                        valor_deducoes: parseFloat(rps.ValorDeducoes),
                                    })), { iss_retido: rps.ISSRetido === "true", valor_iss: valorIss, aliquota: aliquotaPercentual, item_lista_servico: _this.deriveItemListaServico(rps) }), (codigoTribMun && {
                                        codigo_tributario_municipio: codigoTribMun,
                                    })), { discriminacao: rps.Discriminacao || "Serviço não especificado", codigo_municipio: String(codigoMunicipioServico) }),
                                };
                                console.log("✅ Conversão XML → Focus NFe concluída");
                                // DEBUG: Log COMPLETO da requisição que será enviada
                                console.log("\n🔍 DEBUG - PAYLOAD COMPLETO que será enviado para API:");
                                console.log(JSON.stringify(focusRequest, null, 2));
                                resolve(focusRequest);
                            }
                            catch (error) {
                                reject(new Error("Erro ao converter RPS: ".concat(error.message)));
                            }
                        });
                    })];
            });
        });
    };
    /**
     * Formata data de DD/MM/YYYY (padrão brasileiro) para YYYY-MM-DD (ISO)
     * Corrige automaticamente datas invertidas (dia/mês trocados)
     */
    FocusNfeService.prototype.formatarData = function (data) {
        if (!data)
            return new Date().toISOString().split("T")[0];
        // Se já está no formato YYYY-MM-DD, valida se não está com dia/mês invertidos
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            var _a = data.split("-"), ano = _a[0], mes = _a[1], dia = _a[2];
            var dataObj = new Date("".concat(ano, "-").concat(mes, "-").concat(dia, "T12:00:00"));
            var hoje = new Date();
            // Se a data é futura (mais de 30 dias à frente), pode estar invertida
            var diffDias = Math.floor((dataObj.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDias > 30 && parseInt(mes) > 12) {
                // Mês impossível, está claramente invertido
                console.warn("\u26A0\uFE0F  Data com m\u00EAs inv\u00E1lido detectada: ".concat(data, ", invertendo para ").concat(ano, "-").concat(dia, "-").concat(mes));
                return "".concat(ano, "-").concat(dia.padStart(2, "0"), "-").concat(mes.padStart(2, "0"));
            }
            if (diffDias > 30 &&
                parseInt(dia) <= 12 &&
                parseInt(mes) > parseInt(dia)) {
                // Data no futuro distante + dia <= 12 + mês > dia = provável inversão
                console.warn("\u26A0\uFE0F  Data futura detectada: ".concat(data, ", invertendo dia/m\u00EAs para ").concat(ano, "-").concat(dia, "-").concat(mes));
                return "".concat(ano, "-").concat(dia.padStart(2, "0"), "-").concat(mes.padStart(2, "0"));
            }
            return data;
        }
        // Se está em formato DD/MM/YYYY (padrão brasileiro), converte para YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            var _b = data.split("/"), dia = _b[0], mes = _b[1], ano = _b[2];
            return "".concat(ano, "-").concat(mes.padStart(2, "0"), "-").concat(dia.padStart(2, "0"));
        }
        return new Date().toISOString().split("T")[0];
    };
    /**
     * Mapeia TributacaoRPS para formato Focus NFe
     */
    FocusNfeService.prototype.mapearTributacao = function (tributacao) {
        var mapa = {
            T: "T",
            F: "F",
            C: "C",
            N: "N", // Nenhum
        };
        return mapa[tributacao] || "T";
    };
    /**
     * Extrai competência (ano-mês) da data
     */
    FocusNfeService.prototype.extrairCompetencia = function (data) {
        var dataFormatada = this.formatarData(data);
        return dataFormatada.substring(0, 7); // YYYY-MM
    };
    /**
     * Formata código de serviço com zeros à esquerda
     */
    FocusNfeService.prototype.formularCodigo = function (codigo) {
        if (!codigo)
            return "06298"; // Padrão: Serviços de processamento de dados
        return codigo.padStart(5, "0");
    };
    /**
     * Extrai CNPJ do RPS
     */
    FocusNfeService.prototype.extrairCNPJ = function (rps) {
        return rps.CNPJTomador || rps.CNPJ || "";
    };
    /**
     * Extrai CPF do RPS
     */
    FocusNfeService.prototype.extrairCPF = function (rps) {
        return rps.CPFTomador || rps.CPF || "";
    };
    /**
     * Retorna nome do município baseado no código
     */
    FocusNfeService.prototype.extrairMunicipioNome = function (cidade) {
        // Simplificado: retorna o valor recebido ou padrão
        return cidade || "São Paulo";
    };
    /**
     * Converte código IBGE de município para nome
     * Mapeamento dos códigos mais comuns
     */
    FocusNfeService.prototype.obterNomeMunicipio = function (codigoIbge) {
        var municipios = {
            "3550308": "São Paulo",
            "4314902": "Porto Alegre",
            "3550001": "Adamantina",
            "3550002": "Adolfo",
            "3550003": "Aguaí",
            "3550004": "Águas de Lindóia",
            "3550005": "Águas de Santa Bárbara",
            "3550006": "Águas de São Pedro",
            "3550007": "Agudos",
        };
        // Se o código está no mapa, retorna o nome
        if (municipios[codigoIbge]) {
            return municipios[codigoIbge];
        }
        // Fallback: retorna São Paulo como padrão
        return "São Paulo";
    };
    /**
     * Valida e corrige inconsistências entre IBGE, UF e CEP
     * Retorna o IBGE correto baseado no UF informado
     */
    FocusNfeService.prototype.validarECorrigirCodigoMunicipio = function (codigoIbgeOriginal, uf, cep) {
        // Mapa: UF → Prefixo IBGE esperado (primeiros 2 dígitos)
        var ufParaPrefixoIBGE = {
            SP: "35",
            RS: "43",
            RJ: "33",
            MG: "31",
            BA: "29",
            PR: "41",
            SC: "42",
            ES: "32",
            GO: "52",
            DF: "53",
            MT: "51",
            MS: "50",
            AC: "12",
            AM: "13",
            AP: "16",
            PA: "15",
            RO: "23",
            RR: "24",
            TO: "27",
            MA: "11",
            PI: "22",
            CE: "23",
            RN: "24",
            PB: "25",
            PE: "26",
            AL: "27",
            SE: "28",
        };
        // Mapeamento específico de CEP para IBGE (para casos comuns)
        var cepParaIBGE = {
            "90460": "4314902",
            "01310": "3550308",
            "20040020": "3304557", // Rio de Janeiro/RJ
        };
        // Extrai prefixo do CEP
        var prefixoCep = cep.substring(0, 5);
        if (cepParaIBGE[prefixoCep]) {
            console.log("\u2705 CEP ".concat(cep, " mapeado para IBGE ").concat(cepParaIBGE[prefixoCep]));
            return cepParaIBGE[prefixoCep];
        }
        // Valida se o IBGE original bate com o UF
        var prefixoIBGEEsperado = ufParaPrefixoIBGE[uf] || "35"; // Padrão SP
        var prefixoIBGEOriginal = codigoIbgeOriginal.substring(0, 2);
        if (prefixoIBGEOriginal !== prefixoIBGEEsperado) {
            console.warn("\u26A0\uFE0F  AVISO: C\u00F3digo IBGE ".concat(codigoIbgeOriginal, " n\u00E3o bate com UF ").concat(uf));
            console.warn("   IBGE esperado come\u00E7a com: ".concat(prefixoIBGEEsperado, ", mas recebido: ").concat(prefixoIBGEOriginal));
            console.warn("   Usando UF ".concat(uf, " com IBGE padr\u00E3o"));
            // Retorna um IBGE válido baseado no UF
            // Para simplicidade, usa o primeiro código válido do estado
            var codigoPadraoUF = {
                SP: "3550308",
                RS: "4314902",
                RJ: "3304557", // Rio de Janeiro
            };
            return codigoPadraoUF[uf] || "3550308";
        }
        return codigoIbgeOriginal;
    };
    /**
     * Formata CEP para XXXXX-XXX
     */
    FocusNfeService.prototype.formatarCEP = function (cep) {
        if (!cep)
            return "";
        // Remove caracteres especiais
        var cepLimpo = cep.replace(/\D/g, "");
        // Se tem 8 dígitos, formata como XXXXX-XXX
        if (cepLimpo.length === 8) {
            return "".concat(cepLimpo.substring(0, 5), "-").concat(cepLimpo.substring(5));
        }
        return cepLimpo;
    };
    /**
     * Deriva Item Lista Serviço (LC 116/2003) em 6 dígitos: II SS DD
     * Heurística:
     * - Se RPS.CodigoServico é "06298" (comum para intermediação), usa "010700"
     * - Se discriminacao contém "Intermediação", usa "010700"
     * - Fallback: "010700"
     */
    FocusNfeService.prototype.deriveItemListaServico = function (rps) {
        var codigoServico = (rps.CodigoServico || "").toString();
        var discr = (rps.Discriminacao || "").toLowerCase();
        if (codigoServico === "06298")
            return "010700";
        if (discr.includes("intermedia"))
            return "010700";
        // Ajuste futuro: permitir override via env FOCUS_ITEM_LISTA_SERVICO
        var envOverride = process.env.FOCUS_ITEM_LISTA_SERVICO;
        if (envOverride && /^[0-9]{6}$/.test(envOverride))
            return envOverride;
        return "010700";
    };
    /**
     * Deriva cTribMun (código tributário municipal) com 3 dígitos [0-9]{3}.
     * A Focus/NFSe Nacional exige padrão de 3 dígitos. Caso não seja conhecido,
     * omite o campo para evitar erros de schema.
     * Pode ser configurado via env FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO.
     */
    FocusNfeService.prototype.deriveCodigoTributarioMunicipio = function () {
        var env = process.env.FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO;
        if (env && /^[0-9]{3}$/.test(env)) {
            return env;
        }
        return null;
    };
    return FocusNfeService;
}());
exports.FocusNfeService = FocusNfeService;
//# sourceMappingURL=FocusNfeService.js.map