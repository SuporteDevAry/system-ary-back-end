"use strict";
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
/**
 * Busca o código IBGE do município a partir do CEP usando a API ViaCEP
 */
async function buscarIbgePorCep(cep) {
    try {
        const fetch = (await import("node-fetch")).default;
        const cepLimpo = cep.replace(/\D/g, "");
        const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!resp.ok)
            return null;
        const data = await resp.json();
        if (data && data.ibge)
            return data.ibge;
        return null;
    }
    catch (_a) {
        return null;
    }
}
/**
 * Integração com API Focus NFe para envio de NFS-e
 * Documentação: https://doc.focusnfe.com.br/reference/enviarnfse
 *
 * Permite enviar NFS-e para prefeitura via serviço terceirizado
 * Mantém os mesmos métodos que NfseSpService para compatibilidade
 */
const https_1 = __importDefault(require("https"));
const xml2js_1 = require("xml2js");
class FocusNfeService {
    /**
     * Consulta status de uma RPS individual (por número de RPS)
     */
    async consultarRps(rps_number) {
        try {
            console.log(`🔍 Consultando NFS-e (ref/protocolo_lote): ${rps_number} na Focus NFe...`);
            // Conforme doc FocusNFE: GET /nfse/{ref}
            return await this.fazerRequisicaoApi("GET", `/nfse/${rps_number}`);
        }
        catch (error) {
            console.error("❌ Erro ao consultar NFS-e na Focus NFe:", error);
            throw new Error(`Falha na consulta: ${error.message}`);
        }
    }
    constructor() {
        // Sempre usa endpoint oficial FocusNFE até /v2
        let apiUrl = process.env.FOCUS_NFE_API_URL;
        // Remove qualquer /nfse no final
        apiUrl = apiUrl.replace(/\/nfse$/, "");
        this.config = {
            apiUrl,
            apiToken: process.env.FOCUS_NFE_API_TOKEN || "",
            timeout: 30000,
        };
        if (!this.config.apiToken) {
            throw new Error("FOCUS_NFE_API_TOKEN não configurado. Configure a variável de ambiente.");
        }
        console.log("✅ FocusNfeService inicializado");
        console.log(`   API URL: ${this.config.apiUrl}`);
        // Detectar se está em homologação
        const isHomolog = this.config.apiUrl.includes("homologacao");
        console.log(`   Ambiente: ${isHomolog ? "HOMOLOGAÇÃO" : "PRODUÇÃO"}`);
    }
    /**
     * Envia lote de RPS via API Focus NFe
     * Aceita XML gerado pelo frontend e o processa
     */
    async enviarLoteRps(xml) {
        try {
            console.log("📤 Processando XML para envio Focus NFe...");
            const itens = await this.converterXmlParaFocusNfe(xml);
            console.log(`✅ XML convertido para formato Focus NFe (${itens.length} RPS)`);
            const resultados = [];
            for (const item of itens) {
                const { referencia, request, numero_rps } = item;
                const _a = request, { referencia: _ref } = _a, body = __rest(_a, ["referencia"]);
                const response = await this.fazerRequisicaoApi("POST", `/nfse?ref=${referencia}`, body);
                resultados.push(Object.assign(Object.assign({}, response), { ref: (response === null || response === void 0 ? void 0 : response.ref) || referencia, numero_rps }));
            }
            return resultados;
        }
        catch (error) {
            console.error("❌ Erro ao enviar para Focus NFe:", error);
            throw new Error(`Falha no envio: ${error.message}`);
        }
    }
    /**
     * Consulta status de NFS-e na Focus NFe
     */
    async consultarLote(numeroProtocolo) {
        try {
            console.log(`🔍 Consultando NFS-e ${numeroProtocolo} na Focus NFe...`);
            return await this.fazerRequisicaoApi("GET", `/nfse/${numeroProtocolo}?completa=0`);
        }
        catch (error) {
            console.error("❌ Erro ao consultar Focus NFe:", error);
            throw new Error(`Falha na consulta: ${error.message}`);
        }
    }
    /**
     * Cancela NFS-e na Focus NFe
     */
    async cancelarNfse(referencia, justificativa) {
        try {
            console.log(`❌ Cancelando NFS-e ${referencia} na Focus NFe...`);
            return await this.fazerRequisicaoApi("DELETE", `/nfse/${encodeURIComponent(referencia)}`, {
                justificativa,
            });
        }
        catch (error) {
            console.error("❌ Erro ao cancelar NFS-e na Focus NFe:", error);
            throw new Error(`Falha no cancelamento: ${error.message}`);
        }
    }
    /**
     * Faz requisição genérica para a API Focus NFe
     */
    fazerRequisicaoApi(method, endpoint, payload) {
        return new Promise((resolve, reject) => {
            const url = new URL(this.config.apiUrl + endpoint);
            console.log(`\n🔗 Requisição Focus NFe:`);
            console.log(`   Método: ${method}`);
            console.log(`   URL: ${url.href}`);
            // Tenta HTTP Basic Auth: base64(token:)
            const auth = Buffer.from(`${this.config.apiToken}:`).toString("base64");
            console.log(`   Auth: Basic ${auth.substring(0, 10)}...`);
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Basic ${auth}`,
                },
                timeout: this.config.timeout,
            };
            const req = https_1.default.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    // DEBUG: Log do payload enviado para diagnóstico
                    if (payload) {
                        console.log("\n🔍 DEBUG - Payload EXATO enviado no corpo da requisição:");
                        console.log(JSON.stringify(payload, null, 2));
                    }
                    console.log(`\n✅ Resposta Focus NFe (${res.statusCode}):`);
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
                        const response = JSON.parse(data);
                        console.log(JSON.stringify(response, null, 2));
                        if (res.statusCode &&
                            res.statusCode >= 200 &&
                            res.statusCode < 300) {
                            resolve(response);
                        }
                        else {
                            reject(new Error(`API Error ${res.statusCode}: ${response.error || response.message || "Unknown error"}`));
                        }
                    }
                    catch (e) {
                        reject(new Error(`Erro ao parsear resposta: ${data}`));
                    }
                });
            });
            req.on("error", (error) => {
                reject(error);
            });
            req.on("timeout", () => {
                req.destroy();
                reject(new Error("Timeout na requisição Focus NFe"));
            });
            if (payload) {
                req.write(JSON.stringify(payload));
            }
            req.end();
        });
    }
    /**
     * Converte XML do padrão Prefeitura SP para o formato esperado pela Focus NFe
     * XML de entrada: <PedidoEnvioLoteRPS> com um ou mais <RPS>
     * Saída: FocusNfeRequest com formato específico da API
     */
    async converterXmlParaFocusNfe(xml) {
        const fetch = (await import("node-fetch")).default;
        return new Promise((resolve, reject) => {
            (0, xml2js_1.parseString)(xml, { explicitArray: false }, async (err, result) => {
                if (err) {
                    reject(new Error(`Erro ao parsear XML: ${err.message}`));
                    return;
                }
                console.log("XML recebido:", xml);
                try {
                    const pedido = result.PedidoEnvioLoteRPS;
                    const cabecalho = pedido.Cabecalho || {};
                    // Extrai dados do prestador
                    const rpsArray = Array.isArray(pedido.RPS)
                        ? pedido.RPS
                        : [pedido.RPS];
                    const requests = [];
                    const cpfCnpjRemetente = cabecalho.CPFCNPJRemetente || {};
                    for (let index = 0; index < rpsArray.length; index++) {
                        const rps = rpsArray[index];
                        if (!rps)
                            continue;
                        console.log("🔍 DEBUG - Estrutura completa do RPS recebida:");
                        console.log(JSON.stringify(rps, null, 2));
                        const numeroRps = this.extrairNumeroRps(rps, index + 1);
                        const chaveRps = rps.ChaveRPS || {};
                        const inscricaoPrestador = chaveRps.InscricaoPrestador || rps.InscricaoPrestador || "";
                        const cnpjPrestador = cpfCnpjRemetente.CNPJ ||
                            rps.CNPJRemetente ||
                            rps.CNPJ ||
                            process.env.CNPJ_PRESTADOR ||
                            "";
                        const cpfPrestador = cpfCnpjRemetente.CPF ||
                            rps.CPFRemetente ||
                            rps.CPF ||
                            process.env.CPF_PRESTADOR ||
                            "";
                        console.log(`   📋 Extração Prestador:`);
                        console.log(`      IM: ${inscricaoPrestador || "✗ não encontrado"}`);
                        console.log(`      CNPJ: ${cnpjPrestador ? "✓ fornecido" : "✗ não fornecido"}`);
                        console.log(`      CPF: ${cpfPrestador ? "✓ fornecido" : "✗ não fornecido"}`);
                        const cpfCnpjTomador = rps.CPFCNPJTomador || {};
                        const enderecTomador = Object.assign({}, (rps.EnderecoTomador || {}));
                        let cnpjTomador = cpfCnpjTomador.CNPJ || "";
                        let cpfTomador = cpfCnpjTomador.CPF || "";
                        const razaoSocialTomador = rps.RazaoSocialTomador || rps.NomeFantasia || "Cliente";
                        const emailTomador = rps.EmailTomador || "";
                        const isEstrangeiro = !cnpjTomador &&
                            !cpfTomador &&
                            (enderecTomador.UF === "EX" ||
                                enderecTomador.Pais ||
                                enderecTomador.CodigoPais);
                        let codigoMunicipioServico = rps.MunicipioPrestacao || "3550308";
                        let codigoMunicipioTomadorOriginal = enderecTomador.Cidade || codigoMunicipioServico;
                        let codigoMunicipioTomadorCorrigido = this.validarECorrigirCodigoMunicipio(codigoMunicipioTomadorOriginal, enderecTomador.UF, enderecTomador.CEP);
                        if (isEstrangeiro) {
                            cnpjTomador = "";
                            cpfTomador = "";
                            codigoMunicipioTomadorCorrigido = "9999999";
                            enderecTomador.UF = "EX";
                            enderecTomador.CEP = "00000-000";
                            if (!enderecTomador.Bairro)
                                enderecTomador.Bairro = "EXTERIOR";
                            if (!enderecTomador.NumeroEndereco)
                                enderecTomador.NumeroEndereco = "S/N";
                            if (!enderecTomador.CodigoPais && enderecTomador.Pais) {
                                enderecTomador.CodigoPais = enderecTomador.Pais;
                            }
                        }
                        else if (enderecTomador.CEP) {
                            const ibgeViaCep = await buscarIbgePorCep(enderecTomador.CEP);
                            if (ibgeViaCep &&
                                ibgeViaCep !== String(codigoMunicipioTomadorCorrigido)) {
                                console.warn(`[AUTOMÁTICO] Corrigindo codigo_municipio do tomador de ${codigoMunicipioTomadorCorrigido} para ${ibgeViaCep} com base no CEP ${enderecTomador.CEP}`);
                                codigoMunicipioTomadorCorrigido = ibgeViaCep;
                            }
                        }
                        const servicoXml = rps.Servico || {};
                        console.log("🔍 DEBUG - Objeto RPS para extração:", JSON.stringify(rps, null, 2));
                        let valorServicos = 0;
                        const valorServicosKeys = [
                            "ValorServicos",
                            "valorservicos",
                            "valor_servicos",
                            "valorServicos",
                        ];
                        for (const key of valorServicosKeys) {
                            if (rps[key] !== undefined) {
                                valorServicos = parseFloat(rps[key]);
                                break;
                            }
                        }
                        if (!valorServicos && servicoXml.ValorServicos) {
                            valorServicos = parseFloat(servicoXml.ValorServicos);
                        }
                        if (!valorServicos && cabecalho.ValorTotalServicos) {
                            valorServicos = parseFloat(cabecalho.ValorTotalServicos);
                        }
                        let valorFinalCobrado = valorServicos;
                        if (rps.ValorFinalCobrado) {
                            valorFinalCobrado = parseFloat(rps.ValorFinalCobrado);
                        }
                        else if (rps.valorfinalcobrado) {
                            valorFinalCobrado = parseFloat(rps.valorfinalcobrado);
                        }
                        let baseCalculo = valorServicos;
                        if (rps.BaseCalculo) {
                            baseCalculo = parseFloat(rps.BaseCalculo);
                        }
                        else if (rps.basecalculo) {
                            baseCalculo = parseFloat(rps.basecalculo);
                        }
                        const codigoServico = rps.CodigoServico || servicoXml.CodigoServico || "06298";
                        const discriminacao = rps.Discriminacao ||
                            servicoXml.Discriminacao ||
                            "Serviço não especificado";
                        const tributacaoRps = rps.TributacaoRPS ||
                            rps.tributacaoRps ||
                            "";
                        const tipoTributacao = tributacaoRps
                            ? this.mapearTributacao(String(tributacaoRps).trim().toUpperCase())
                            : undefined;
                        const codigoCidadeIncidencia = tipoTributacao === "P" ? "9999999" : undefined;
                        const isExportacao = this.identificarExportacao(rps, servicoXml, isEstrangeiro, tipoTributacao);
                        const aliquotaPercentual = parseFloat(rps.aliquota || rps.AliquotaServicos || "5");
                        const valorIss = Math.round(valorServicos * (aliquotaPercentual / 100) * 100) / 100;
                        const valorIBS = Math.round(valorServicos * 0.01 * 100) / 100;
                        const valorCBS = Math.round(valorServicos * 0.09 * 100) / 100;
                        const valorIssXml = this.extrairNumeroOpcional(rps.ValorIss, rps.ValorISS, rps.valor_iss, servicoXml.ValorIss, servicoXml.ValorISS, servicoXml.valor_iss);
                        const tributacaoIssXml = this.extrairTextoOpcional(rps.TributacaoIss, rps.TributacaoISS, rps.tributacao_iss, servicoXml.TributacaoIss, servicoXml.TributacaoISS, servicoXml.tributacao_iss);
                        const ibsCbsSituacaoTributariaXml = this.extrairTextoOpcional(rps.IBSCBSSituacaoTributaria, rps.ibs_cbs_situacao_tributaria, servicoXml.IBSCBSSituacaoTributaria, servicoXml.ibs_cbs_situacao_tributaria);
                        const ibsCbsBaseCalculoXml = this.extrairNumeroOpcional(rps.IBSCBSBaseCalculo, rps.ibs_cbs_base_calculo, servicoXml.IBSCBSBaseCalculo, servicoXml.ibs_cbs_base_calculo);
                        const ibsUfAliquotaXml = this.extrairNumeroOpcional(rps.IBSUFAliquota, rps.ibs_uf_aliquota, servicoXml.IBSUFAliquota, servicoXml.ibs_uf_aliquota);
                        const ibsUfValorXml = this.extrairNumeroOpcional(rps.IBSUFValor, rps.ibs_uf_valor, servicoXml.IBSUFValor, servicoXml.ibs_uf_valor);
                        const ibsMunAliquotaXml = this.extrairNumeroOpcional(rps.IBSMunAliquota, rps.ibs_mun_aliquota, servicoXml.IBSMunAliquota, servicoXml.ibs_mun_aliquota);
                        const ibsMunValorXml = this.extrairNumeroOpcional(rps.IBSMunValor, rps.ibs_mun_valor, servicoXml.IBSMunValor, servicoXml.ibs_mun_valor);
                        const cbsAliquotaXml = this.extrairNumeroOpcional(rps.CBSAliquota, rps.cbs_aliquota, servicoXml.CBSAliquota, servicoXml.cbs_aliquota);
                        const cbsValorXml = this.extrairNumeroOpcional(rps.CBSValor, rps.cbs_valor, servicoXml.CBSValor, servicoXml.cbs_valor);
                        const ibsValorXml = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                            "IBS",
                            "ValorIBS",
                            "ValorIbs",
                            "ibs_value",
                        ]), this.buscarCampoRecursivo(servicoXml, [
                            "IBS",
                            "ValorIBS",
                            "ValorIbs",
                            "ibs_value",
                        ]));
                        const ibsValueFallback = (ibsUfValorXml !== null && ibsUfValorXml !== void 0 ? ibsUfValorXml : 0) + (ibsMunValorXml !== null && ibsMunValorXml !== void 0 ? ibsMunValorXml : 0) || valorIBS;
                        const pisValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                            "PIS",
                            "ValorPIS",
                            "ValorPis",
                            "valor_pis",
                        ]), this.buscarCampoRecursivo(servicoXml, [
                            "PIS",
                            "ValorPIS",
                            "ValorPis",
                            "valor_pis",
                        ]));
                        const cofinsValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                            "COFINS",
                            "ValorCOFINS",
                            "ValorCofins",
                            "valor_cofins",
                        ]), this.buscarCampoRecursivo(servicoXml, [
                            "COFINS",
                            "ValorCOFINS",
                            "ValorCofins",
                            "valor_cofins",
                        ]));
                        const csllValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                            "CSLL",
                            "ValorCSLL",
                            "ValorCsll",
                            "valor_csll",
                        ]), this.buscarCampoRecursivo(servicoXml, [
                            "CSLL",
                            "ValorCSLL",
                            "ValorCsll",
                            "valor_csll",
                        ]));
                        const irrfValue = this.extrairNumeroOpcional(this.buscarCampoRecursivo(rps, [
                            "valorIR",
                            "ValorIR",
                            "IRRF",
                            "ValorIRRF",
                            "ValorIrrf",
                            "valor_irrf",
                        ]), this.buscarCampoRecursivo(servicoXml, [
                            "valorIR",
                            "ValorIR",
                            "IRRF",
                            "ValorIRRF",
                            "ValorIrrf",
                            "valor_irrf",
                        ]));
                        const insEst = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, [
                            "InscricaoEstadual",
                            "InsEst",
                            "ins_est",
                        ]), this.buscarCampoRecursivo(servicoXml, [
                            "InscricaoEstadual",
                            "InsEst",
                            "ins_est",
                        ]));
                        const ownerRecord = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["OwnerRecord", "owner_record"]), this.buscarCampoRecursivo(servicoXml, [
                            "OwnerRecord",
                            "owner_record",
                        ]));
                        const ownerSend = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["OwnerSend", "owner_send"]), this.buscarCampoRecursivo(servicoXml, [
                            "OwnerSend",
                            "owner_send",
                        ]));
                        const liquidada = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["Liquidada", "liquidada"]), this.buscarCampoRecursivo(servicoXml, [
                            "Liquidada",
                            "liquidada",
                        ]));
                        const receiptDate = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["ReceiptDate", "receipt_date"]), this.buscarCampoRecursivo(servicoXml, [
                            "ReceiptDate",
                            "receipt_date",
                        ]));
                        const reciboDate = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["ReciboDate", "recibo_date"]), this.buscarCampoRecursivo(servicoXml, [
                            "ReciboDate",
                            "recibo_date",
                        ]));
                        const ibsCbsClassificacaoTributaria = this.extrairTextoOpcional(this.buscarCampoRecursivo(rps, ["cClassTrib", "cclasstrib"]), this.buscarCampoRecursivo(servicoXml, [
                            "cClassTrib",
                            "cclasstrib",
                        ]));
                        const aliquotaParaEnvio = aliquotaPercentual > 0 ? aliquotaPercentual : 5;
                        const prestadorObj = {
                            inscricao_municipal: inscricaoPrestador,
                            codigo_municipio: String("3550308"),
                        };
                        if (cnpjPrestador.trim()) {
                            prestadorObj.cnpj = cnpjPrestador;
                        }
                        if (cpfPrestador.trim()) {
                            prestadorObj.cpf = cpfPrestador;
                        }
                        if (!prestadorObj.cnpj && !prestadorObj.cpf) {
                            throw new Error("Prestador sem CNPJ nem CPF. Configure CNPJ_PRESTADOR ou CPF_PRESTADOR em .env");
                        }
                        const codigoTribMun = this.deriveCodigoTributarioMunicipio();
                        const naturezaOperacao = tipoTributacao === "P"
                            ? 2
                            : this.extrairNumero(rps.NaturezaOperacao || servicoXml.NaturezaOperacao, 1);
                        const tipoOperacao = this.extrairNumero(rps.TipoOperacao || servicoXml.TipoOperacao, isExportacao ? 2 : 1);
                        const issRetido = this.extrairBooleano(rps.ISSRetido || servicoXml.ISSRetido, false);
                        const referencia = `LOTE-${Date.now()}-${index + 1}-${numeroRps || "RPS"}`;
                        const focusRequest = Object.assign(Object.assign({ serie_rps: "1", numero_rps: numeroRps, referencia, data_emissao: this.formatarData(rps.DataEmissao), natureza_operacao: naturezaOperacao, optante_simples_nacional: false, tipo_operacao_governamental: 1 }, (tipoTributacao && { tributacao_rps: tipoTributacao })), { prestador: Object.assign(Object.assign(Object.assign({}, (cnpjPrestador && { cnpj: cnpjPrestador })), (cpfPrestador && { cpf: cpfPrestador })), { inscricao_municipal: inscricaoPrestador, codigo_municipio: String("3550308") }), tomador: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (cnpjTomador && { cnpj: cnpjTomador })), (cpfTomador && { cpf: cpfTomador })), { razao_social: razaoSocialTomador }), (emailTomador && { email: emailTomador })), { endereco: Object.assign(Object.assign(Object.assign({ logradouro: (enderecTomador.Logradouro || "")
                                        .trim()
                                        .substring(0, 50), numero: enderecTomador.NumeroEndereco || "S/N" }, (enderecTomador.ComplementoEndereco && {
                                    complemento: enderecTomador.ComplementoEndereco,
                                })), { bairro: enderecTomador.Bairro || "", codigo_municipio: tipoTributacao === "P"
                                        ? ""
                                        : String(codigoMunicipioTomadorCorrigido), uf: enderecTomador.UF, cep: this.formatarCEP(enderecTomador.CEP) }), (isEstrangeiro &&
                                    enderecTomador.CodigoPais && {
                                    codigo_pais: enderecTomador.CodigoPais,
                                })) }), servico: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ discriminacao: discriminacao, item_lista_servico: codigoServico, codigo_tributacao_municipio: codigoTribMun || codigoServico }, (codigoCidadeIncidencia && {
                                codigo_cidade_incidencia: codigoCidadeIncidencia,
                            })), { valor_servicos: valorServicos, valor_final_cobrado: valorFinalCobrado, base_calculo: baseCalculo, aliquota: aliquotaParaEnvio, iss_retido: issRetido, valor_ipi: 0, codigo_nbs: "102010000", codigo_indicador_operacao: "100301", ibs_cbs_classificacao_tributaria: ibsCbsClassificacaoTributaria || "", valor_ir: irrfValue, valor_iss: valorIssXml !== null && valorIssXml !== void 0 ? valorIssXml : valorIss }), (tributacaoIssXml && { tributacao_iss: tributacaoIssXml })), (ibsCbsSituacaoTributariaXml && {
                                ibs_cbs_situacao_tributaria: ibsCbsSituacaoTributariaXml,
                            })), { ibs_cbs_base_calculo: ibsCbsBaseCalculoXml !== null && ibsCbsBaseCalculoXml !== void 0 ? ibsCbsBaseCalculoXml : baseCalculo, ibs_uf_aliquota: ibsUfAliquotaXml !== null && ibsUfAliquotaXml !== void 0 ? ibsUfAliquotaXml : 1, ibs_uf_valor: ibsUfValorXml !== null && ibsUfValorXml !== void 0 ? ibsUfValorXml : valorIBS, ibs_mun_aliquota: ibsMunAliquotaXml !== null && ibsMunAliquotaXml !== void 0 ? ibsMunAliquotaXml : 0, ibs_mun_valor: ibsMunValorXml !== null && ibsMunValorXml !== void 0 ? ibsMunValorXml : 0, cbs_aliquota: cbsAliquotaXml !== null && cbsAliquotaXml !== void 0 ? cbsAliquotaXml : 9, cbs_valor: cbsValorXml !== null && cbsValorXml !== void 0 ? cbsValorXml : valorCBS }), exigibilidade_suspensa: 0, pagamento_parcelado_antecipado: 0, finalidade_emissao: 0, consumidor_final: 0, indicador_destinatario: 0 });
                        console.log("✅ Conversão XML → Focus NFe concluída");
                        console.log("\n🔍 DEBUG - PAYLOAD COMPLETO que será enviado para API:");
                        console.log(JSON.stringify(focusRequest, null, 2));
                        requests.push({
                            numero_rps: numeroRps,
                            referencia,
                            request: focusRequest,
                            invoice_data: {
                                pis_value: pisValue !== null && pisValue !== void 0 ? pisValue : null,
                                cofins_value: cofinsValue !== null && cofinsValue !== void 0 ? cofinsValue : null,
                                csll_value: csllValue !== null && csllValue !== void 0 ? csllValue : null,
                                irrf_value: irrfValue !== null && irrfValue !== void 0 ? irrfValue : null,
                                iss_value: valorIssXml !== null && valorIssXml !== void 0 ? valorIssXml : valorIss,
                                ibs_value: ibsValorXml !== null && ibsValorXml !== void 0 ? ibsValorXml : ibsValueFallback,
                                cbs_value: cbsValorXml !== null && cbsValorXml !== void 0 ? cbsValorXml : valorCBS,
                                ins_est: insEst !== null && insEst !== void 0 ? insEst : null,
                                owner_record: ownerRecord !== null && ownerRecord !== void 0 ? ownerRecord : null,
                                owner_send: ownerSend !== null && ownerSend !== void 0 ? ownerSend : null,
                                liquidada: liquidada !== null && liquidada !== void 0 ? liquidada : null,
                                receipt_date: receiptDate !== null && receiptDate !== void 0 ? receiptDate : null,
                                recibo_date: reciboDate !== null && reciboDate !== void 0 ? reciboDate : null,
                            },
                        });
                    }
                    if (!requests.length) {
                        throw new Error("Nenhum RPS encontrado no XML informado");
                    }
                    resolve(requests);
                }
                catch (error) {
                    reject(new Error(`Erro ao converter RPS: ${error.message}`));
                }
            });
        });
    }
    /**
     * Formata data de DD/MM/YYYY (padrão brasileiro) para YYYY-MM-DD (ISO)
     * Corrige automaticamente datas invertidas (dia/mês trocados)
     */
    formatarData(data) {
        if (!data)
            return new Date().toISOString().split("T")[0];
        // Se já está no formato YYYY-MM-DD, valida se não está com dia/mês invertidos
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            const [ano, mes, dia] = data.split("-");
            const dataObj = new Date(`${ano}-${mes}-${dia}T12:00:00`);
            const hoje = new Date();
            // Se a data é futura (mais de 30 dias à frente), pode estar invertida
            const diffDias = Math.floor((dataObj.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDias > 30 && parseInt(mes) > 12) {
                // Mês impossível, está claramente invertido
                console.warn(`⚠️  Data com mês inválido detectada: ${data}, invertendo para ${ano}-${dia}-${mes}`);
                return `${ano}-${dia.padStart(2, "0")}-${mes.padStart(2, "0")}`;
            }
            if (diffDias > 30 &&
                parseInt(dia) <= 12 &&
                parseInt(mes) > parseInt(dia)) {
                // Data no futuro distante + dia <= 12 + mês > dia = provável inversão
                console.warn(`⚠️  Data futura detectada: ${data}, invertendo dia/mês para ${ano}-${dia}-${mes}`);
                return `${ano}-${dia.padStart(2, "0")}-${mes.padStart(2, "0")}`;
            }
            return data;
        }
        // Se está em formato DD/MM/YYYY (padrão brasileiro), converte para YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            const [dia, mes, ano] = data.split("/");
            return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
        }
        return new Date().toISOString().split("T")[0];
    }
    /**
     * Mapeia TributacaoRPS para formato Focus NFe
     */
    mapearTributacao(tributacao) {
        const mapa = {
            T: "T",
            F: "F",
            C: "C",
            N: "N",
            P: "P", // ExportaÃ§Ã£o / regime especÃ­fico informado pelo XML
        };
        return mapa[tributacao] || "T";
    }
    /**
     * Extrai competência (ano-mês) da data
     */
    identificarExportacao(rps, servicoXml, isEstrangeiro, tributacaoIss) {
        if (isEstrangeiro)
            return true;
        const indicadores = [
            rps.exportacao,
            rps.Exportacao,
            rps.ExportacaoServico,
            servicoXml.exportacao,
            servicoXml.Exportacao,
            servicoXml.ExportacaoServico,
        ];
        if (indicadores.some((valor) => this.extrairBooleano(valor, false))) {
            return true;
        }
        return tributacaoIss === "F" || tributacaoIss === "P";
    }
    extrairNumero(valor, padrao) {
        if (valor === undefined || valor === null || valor === "") {
            return padrao;
        }
        const numero = Number(valor);
        return Number.isFinite(numero) ? numero : padrao;
    }
    extrairBooleano(valor, padrao) {
        if (valor === undefined || valor === null || valor === "") {
            return padrao;
        }
        if (typeof valor === "boolean")
            return valor;
        if (typeof valor === "number")
            return valor !== 0;
        const normalizado = String(valor).trim().toLowerCase();
        if (["1", "true", "t", "sim", "s", "yes", "y"].includes(normalizado)) {
            return true;
        }
        if (["0", "false", "f", "nao", "não", "n", "no"].includes(normalizado)) {
            return false;
        }
        return padrao;
    }
    extrairTextoOpcional(...valores) {
        for (const valor of valores) {
            if (valor === undefined || valor === null)
                continue;
            const texto = String(valor).trim();
            if (texto)
                return texto;
        }
        return undefined;
    }
    extrairNumeroOpcional(...valores) {
        for (const valor of valores) {
            if (valor === undefined || valor === null || valor === "")
                continue;
            const texto = String(valor).trim();
            const normalizado = texto.includes(",")
                ? texto.replace(/\./g, "").replace(",", ".")
                : texto;
            const numero = Number(normalizado);
            if (Number.isFinite(numero))
                return numero;
        }
        return undefined;
    }
    normalizarChaveCampo(valor) {
        return String(valor || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
    }
    buscarCampoRecursivo(alvo, nomes) {
        if (alvo === undefined || alvo === null)
            return undefined;
        const nomesNormalizados = nomes.map((nome) => this.normalizarChaveCampo(nome));
        const procurar = (valor) => {
            if (valor === undefined || valor === null)
                return undefined;
            if (Array.isArray(valor)) {
                for (const item of valor) {
                    const encontrado = procurar(item);
                    if (encontrado !== undefined)
                        return encontrado;
                }
                return undefined;
            }
            if (typeof valor !== "object")
                return undefined;
            for (const [chave, conteudo] of Object.entries(valor)) {
                if (nomesNormalizados.includes(this.normalizarChaveCampo(chave))) {
                    return conteudo;
                }
            }
            for (const conteudo of Object.values(valor)) {
                const encontrado = procurar(conteudo);
                if (encontrado !== undefined)
                    return encontrado;
            }
            return undefined;
        };
        return procurar(alvo);
    }
    extrairNumeroRps(rps, padrao) {
        var _a, _b;
        const numero = (rps === null || rps === void 0 ? void 0 : rps.NumeroRPS) ||
            (rps === null || rps === void 0 ? void 0 : rps.numeroRps) ||
            (rps === null || rps === void 0 ? void 0 : rps.numero_rps) ||
            ((_a = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _a === void 0 ? void 0 : _a.NumeroRPS) ||
            ((_b = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _b === void 0 ? void 0 : _b.numeroRps) ||
            padrao;
        return String(numero).trim();
    }
    extrairCompetencia(data) {
        const dataFormatada = this.formatarData(data);
        return dataFormatada.substring(0, 7); // YYYY-MM
    }
    /**
     * Formata código de serviço com zeros à esquerda
     */
    formularCodigo(codigo) {
        if (!codigo)
            return "06298"; // Padrão: Serviços de processamento de dados
        return codigo.padStart(5, "0");
    }
    /**
     * Extrai CNPJ do RPS
     */
    extrairCNPJ(rps) {
        return rps.CNPJTomador || rps.CNPJ || "";
    }
    /**
     * Extrai CPF do RPS
     */
    extrairCPF(rps) {
        return rps.CPFTomador || rps.CPF || "";
    }
    /**
     * Retorna nome do município baseado no código
     */
    extrairMunicipioNome(cidade) {
        // Simplificado: retorna o valor recebido ou padrão
        return cidade || "São Paulo";
    }
    /**
     * Converte código IBGE de município para nome
     * Mapeamento dos códigos mais comuns
     */
    obterNomeMunicipio(codigoIbge) {
        const municipios = {
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
    }
    /**
     * Valida e corrige inconsistências entre IBGE, UF e CEP
     * Retorna o IBGE correto baseado no UF informado
     */
    validarECorrigirCodigoMunicipio(codigoIbgeOriginal, uf, cep) {
        // Mapa: UF → Prefixo IBGE esperado (primeiros 2 dígitos)
        const ufParaPrefixoIBGE = {
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
        const cepParaIBGE = {
            "90460": "4314902",
            "01310": "3550308",
            "02550": "3550308",
            "13560": "3548906",
            "20040020": "3304557", // Rio de Janeiro/RJ
        };
        // Extrai prefixo do CEP
        const prefixoCep = cep.substring(0, 5);
        if (cepParaIBGE[prefixoCep]) {
            console.log(`✅ CEP ${cep} mapeado para IBGE ${cepParaIBGE[prefixoCep]}`);
            return cepParaIBGE[prefixoCep];
        }
        // Valida se o IBGE original bate com o UF
        const prefixoIBGEEsperado = ufParaPrefixoIBGE[uf] || "35"; // Padrão SP
        const prefixoIBGEOriginal = codigoIbgeOriginal.substring(0, 2);
        if (prefixoIBGEOriginal !== prefixoIBGEEsperado) {
            console.warn(`⚠️  AVISO: Código IBGE ${codigoIbgeOriginal} não bate com UF ${uf}`);
            console.warn(`   IBGE esperado começa com: ${prefixoIBGEEsperado}, mas recebido: ${prefixoIBGEOriginal}`);
            console.warn(`   Usando UF ${uf} com IBGE padrão`);
            // Retorna um IBGE válido baseado no UF
            // Para simplicidade, usa o primeiro código válido do estado
            const codigoPadraoUF = {
                SP: "3550308",
                RS: "4314902",
                RJ: "3304557", // Rio de Janeiro
            };
            return codigoPadraoUF[uf] || "3550308";
        }
        return codigoIbgeOriginal;
    }
    /**
     * Formata CEP para XXXXX-XXX
     */
    formatarCEP(cep) {
        if (!cep)
            return "";
        // Remove caracteres especiais
        const cepLimpo = cep.replace(/\D/g, "");
        // Se tem 8 dígitos, formata como XXXXX-XXX
        if (cepLimpo.length === 8) {
            return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
        }
        return cepLimpo;
    }
    /**
     * Deriva Item Lista Serviço (LC 116/2003) em 6 dígitos: II SS DD
     * Heurística:
     * - Se RPS.CodigoServico é "06298" (comum para intermediação), usa "010700"
     * - Se discriminacao contém "Intermediação", usa "010700"
     * - Fallback: "010700"
     */
    deriveItemListaServico(rps) {
        const codigoServico = (rps.CodigoServico || "").toString();
        const discr = (rps.Discriminacao || "").toLowerCase();
        if (codigoServico === "06298")
            return "06298";
        if (discr.includes("intermedia"))
            return "06298";
        // Ajuste futuro: permitir override via env FOCUS_ITEM_LISTA_SERVICO
        const envOverride = process.env.FOCUS_ITEM_LISTA_SERVICO;
        if (envOverride && /^[0-9]{6}$/.test(envOverride))
            return envOverride;
        return "06298";
    }
    /**
     * Deriva cTribMun (código tributário municipal) com 3 dígitos [0-9]{3}.
     * A Focus/NFSe Nacional exige padrão de 3 dígitos. Caso não seja conhecido,
     * omite o campo para evitar erros de schema.
     * Pode ser configurado via env FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO.
     */
    deriveCodigoTributarioMunicipio() {
        const env = process.env.FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO;
        if (env && /^[0-9]{3}$/.test(env)) {
            return env;
        }
        return null;
    }
}
exports.FocusNfeService = FocusNfeService;
//# sourceMappingURL=FocusNfeService.js.map