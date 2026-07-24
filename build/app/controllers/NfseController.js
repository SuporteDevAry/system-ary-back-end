"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NfseController = void 0;
const xml2js_1 = require("xml2js");
const InvoiceRepository_1 = require("../repositories/InvoiceRepository");
const FocusNfeService_1 = require("../../services/FocusNfeService");
const api_errors_1 = require("../helpers/api-errors");
function mapStatus(status) {
    if (!status)
        return "";
    const s = String(status).toLowerCase();
    if (s.includes("erro"))
        return "erro_autorizacao";
    if (s.includes("cancel"))
        return "cancelada";
    if (s.includes("process"))
        return "processando_autorizacao";
    if (s.includes("autoriza") || s.includes("autoriz"))
        return "emitida";
    return s;
}
function normalizarStatusFocusNfe(valor) {
    if (Array.isArray(valor)) {
        return valor.map((item) => normalizarStatusFocusNfe(item));
    }
    if (valor && typeof valor === "object") {
        const resultado = {};
        for (const [chave, conteudo] of Object.entries(valor)) {
            if (chave === "status" || chave === "Status") {
                resultado[chave] = mapStatus(typeof conteudo === "string" ? conteudo : conteudo ? String(conteudo) : "");
                continue;
            }
            resultado[chave] = normalizarStatusFocusNfe(conteudo);
        }
        return resultado;
    }
    return valor;
}
function extrairStatusRespostaFocusNfe(result) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const candidatos = [
        result === null || result === void 0 ? void 0 : result.status,
        result === null || result === void 0 ? void 0 : result.Status,
        result === null || result === void 0 ? void 0 : result.situacao,
        result === null || result === void 0 ? void 0 : result.Situacao,
        result === null || result === void 0 ? void 0 : result.message,
        result === null || result === void 0 ? void 0 : result.mensagem,
        (_a = result === null || result === void 0 ? void 0 : result.resultado) === null || _a === void 0 ? void 0 : _a.status,
        (_b = result === null || result === void 0 ? void 0 : result.resultado) === null || _b === void 0 ? void 0 : _b.Status,
        (_c = result === null || result === void 0 ? void 0 : result.resultado) === null || _c === void 0 ? void 0 : _c.situacao,
        (_d = result === null || result === void 0 ? void 0 : result.resultado) === null || _d === void 0 ? void 0 : _d.Situacao,
        (_e = result === null || result === void 0 ? void 0 : result.resultado) === null || _e === void 0 ? void 0 : _e.message,
        (_f = result === null || result === void 0 ? void 0 : result.resultado) === null || _f === void 0 ? void 0 : _f.mensagem,
        (_g = result === null || result === void 0 ? void 0 : result.data) === null || _g === void 0 ? void 0 : _g.status,
        (_h = result === null || result === void 0 ? void 0 : result.data) === null || _h === void 0 ? void 0 : _h.Status,
        (_j = result === null || result === void 0 ? void 0 : result.data) === null || _j === void 0 ? void 0 : _j.situacao,
        (_k = result === null || result === void 0 ? void 0 : result.data) === null || _k === void 0 ? void 0 : _k.Situacao,
        (_l = result === null || result === void 0 ? void 0 : result.data) === null || _l === void 0 ? void 0 : _l.message,
        (_m = result === null || result === void 0 ? void 0 : result.data) === null || _m === void 0 ? void 0 : _m.mensagem,
    ];
    for (const candidato of candidatos) {
        const mapped = mapStatus(typeof candidato === "string" ? candidato : candidato ? String(candidato) : "");
        if (mapped)
            return mapped;
    }
    return "";
}
function extrairNumeroNfse(item) {
    const valor = (item === null || item === void 0 ? void 0 : item.numero_nfse) ||
        (item === null || item === void 0 ? void 0 : item.numeroNfse) ||
        (item === null || item === void 0 ? void 0 : item.numero) ||
        (item === null || item === void 0 ? void 0 : item.nfs_number) ||
        (item === null || item === void 0 ? void 0 : item.numero_nota) ||
        (item === null || item === void 0 ? void 0 : item.numeroNota) ||
        null;
    return valor ? String(valor).trim() : null;
}
function extrairCodigoVerificacao(item) {
    var _a, _b, _c, _d;
    const candidatos = [
        item === null || item === void 0 ? void 0 : item.codigo_verificacao,
        item === null || item === void 0 ? void 0 : item.codigoVerificacao,
        item === null || item === void 0 ? void 0 : item.codigo_verif,
        item === null || item === void 0 ? void 0 : item.code_verif,
        (_a = item === null || item === void 0 ? void 0 : item.resultado) === null || _a === void 0 ? void 0 : _a.codigo_verificacao,
        (_b = item === null || item === void 0 ? void 0 : item.resultado) === null || _b === void 0 ? void 0 : _b.codigoVerificacao,
        (_c = item === null || item === void 0 ? void 0 : item.data) === null || _c === void 0 ? void 0 : _c.codigo_verificacao,
        (_d = item === null || item === void 0 ? void 0 : item.data) === null || _d === void 0 ? void 0 : _d.codigoVerificacao,
    ];
    for (const candidato of candidatos) {
        if (candidato === undefined || candidato === null)
            continue;
        const valor = String(candidato).trim();
        if (valor)
            return valor;
    }
    return null;
}
function extrairUrlDanfse(item) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const candidatos = [
        item === null || item === void 0 ? void 0 : item.url_danfse,
        item === null || item === void 0 ? void 0 : item.urlDanfse,
        item === null || item === void 0 ? void 0 : item.danfse_url,
        item === null || item === void 0 ? void 0 : item.danfe_url,
        (_a = item === null || item === void 0 ? void 0 : item.resultado) === null || _a === void 0 ? void 0 : _a.url_danfse,
        (_b = item === null || item === void 0 ? void 0 : item.resultado) === null || _b === void 0 ? void 0 : _b.urlDanfse,
        (_c = item === null || item === void 0 ? void 0 : item.resultado) === null || _c === void 0 ? void 0 : _c.danfse_url,
        (_d = item === null || item === void 0 ? void 0 : item.resultado) === null || _d === void 0 ? void 0 : _d.danfe_url,
        (_e = item === null || item === void 0 ? void 0 : item.data) === null || _e === void 0 ? void 0 : _e.url_danfse,
        (_f = item === null || item === void 0 ? void 0 : item.data) === null || _f === void 0 ? void 0 : _f.urlDanfse,
        (_g = item === null || item === void 0 ? void 0 : item.data) === null || _g === void 0 ? void 0 : _g.danfse_url,
        (_h = item === null || item === void 0 ? void 0 : item.data) === null || _h === void 0 ? void 0 : _h.danfe_url,
    ];
    for (const candidato of candidatos) {
        if (candidato === undefined || candidato === null)
            continue;
        const valor = String(candidato).trim();
        if (valor)
            return valor;
    }
    return null;
}
function extrairReferenciaLote(item, fallback) {
    const valor = (item === null || item === void 0 ? void 0 : item.ref) ||
        (item === null || item === void 0 ? void 0 : item.referencia) ||
        (item === null || item === void 0 ? void 0 : item.protocolo_lote) ||
        (item === null || item === void 0 ? void 0 : item.numero_lote) ||
        (item === null || item === void 0 ? void 0 : item.protocolo) ||
        fallback ||
        null;
    return valor ? String(valor).trim() : null;
}
function extrairNumeroRpsDaReferencia(referencia) {
    if (!referencia)
        return null;
    const valor = String(referencia).trim();
    const partes = valor.split("-");
    if (partes.length < 4)
        return null;
    const candidato = partes[partes.length - 1].trim();
    return candidato ? candidato : null;
}
function extrairNumeroRpsRetorno(item) {
    const valor = (item === null || item === void 0 ? void 0 : item.numero_rps) ||
        (item === null || item === void 0 ? void 0 : item.numeroRps) ||
        (item === null || item === void 0 ? void 0 : item.rps_number) ||
        (item === null || item === void 0 ? void 0 : item.numero) ||
        extrairNumeroRpsDaReferencia(extrairReferenciaLote(item, null)) ||
        null;
    return valor ? String(valor).trim() : null;
}
async function extrairNumerosRpsDoXml(xml) {
    return new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(xml, { explicitArray: false }, (err, result) => {
            if (err) {
                reject(new Error(`Erro ao parsear XML do lote: ${err.message}`));
                return;
            }
            const pedido = result === null || result === void 0 ? void 0 : result.PedidoEnvioLoteRPS;
            const rpsArray = (pedido === null || pedido === void 0 ? void 0 : pedido.RPS)
                ? Array.isArray(pedido.RPS)
                    ? pedido.RPS
                    : [pedido.RPS]
                : [];
            const numeros = rpsArray
                .map((rps) => {
                var _a, _b;
                return String((rps === null || rps === void 0 ? void 0 : rps.NumeroRPS) ||
                    (rps === null || rps === void 0 ? void 0 : rps.numeroRps) ||
                    (rps === null || rps === void 0 ? void 0 : rps.numero_rps) ||
                    ((_a = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _a === void 0 ? void 0 : _a.NumeroRPS) ||
                    ((_b = rps === null || rps === void 0 ? void 0 : rps.ChaveRPS) === null || _b === void 0 ? void 0 : _b.numeroRps) ||
                    "").trim();
            })
                .filter(Boolean);
            resolve(numeros);
        });
    });
}
const focusNfeService = new FocusNfeService_1.FocusNfeService();
exports.NfseController = {
    /**
     * Envia lote de RPS para a Focus NFe
     * POST /api/nfse/enviar-lote
     * Body: { xml: string }
     */
    async enviarLoteRps(req, res) {
        try {
            const { xml } = req.body;
            if (!xml || typeof xml !== "string") {
                throw new api_errors_1.BadRequestError("XML do lote não informado");
            }
            const result = await focusNfeService.enviarLoteRps(xml);
            const numerosRpsXml = await extrairNumerosRpsDoXml(xml);
            const resultados = Array.isArray(result)
                ? result
                : Array.isArray(result === null || result === void 0 ? void 0 : result.resultado)
                    ? result.resultado
                    : result
                        ? [result]
                        : [];
            if (resultados.length > 1 && numerosRpsXml.length > 0) {
                console.log(`[NFSe] XML contém ${numerosRpsXml.length} RPS e a resposta retornou ${resultados.length} itens`);
            }
            for (let index = 0; index < resultados.length; index++) {
                const item = resultados[index] || {};
                const referenciaLote = extrairReferenciaLote(item, (result === null || result === void 0 ? void 0 : result.ref) || null);
                const numeroRpsXml = numerosRpsXml[index] || null;
                const numeroRpsRetorno = extrairNumeroRpsRetorno(item) || "";
                const invoiceData = item.invoice_data || {};
                const codigoVerificacao = extrairCodigoVerificacao(item);
                const numeroRps = extrairNumeroRpsDaReferencia(referenciaLote) ||
                    numeroRpsRetorno ||
                    numeroRpsXml ||
                    "";
                if (!numeroRps) {
                    console.warn(`[NFSe] Resultado sem número de RPS identificável no índice ${index}`);
                    continue;
                }
                if (numeroRpsXml && numeroRpsXml !== numeroRps) {
                    console.warn(`[NFSe] Divergência de mapeamento no índice ${index}: XML=${numeroRpsXml} retorno=${numeroRps}`);
                }
                if (numeroRpsRetorno && numeroRpsRetorno !== numeroRps) {
                    console.warn(`[NFSe] Retorno da API indicou RPS ${numeroRpsRetorno}, mas a referência aponta para RPS ${numeroRps}`);
                }
                if (numeroRpsXml && numeroRpsXml !== numeroRpsRetorno && numeroRpsRetorno) {
                    console.warn(`[NFSe] Retorno da API trouxe RPS ${numeroRpsRetorno}, que não foi localizado no XML enviado`);
                }
                const invoice = (referenciaLote &&
                    (await InvoiceRepository_1.InvoiceRepository.findByProtocoloLote(referenciaLote))) ||
                    (await InvoiceRepository_1.InvoiceRepository.findByRps_number(numeroRps));
                if (invoice) {
                    const numeroNfse = extrairNumeroNfse(item);
                    const updates = Object.assign(Object.assign(Object.assign({ status: item.status ? mapStatus(item.status) : null }, (numeroNfse && { nfs_number: numeroNfse })), (referenciaLote && { protocolo_lote: referenciaLote })), { xml_nfse: xml });
                    const camposTributarios = [
                        "pis_value",
                        "cofins_value",
                        "csll_value",
                        "irrf_value",
                        "iss_value",
                        "ibs_value",
                        "cbs_value",
                        "ins_est",
                        "owner_record",
                        "owner_send",
                        "liquidada",
                        "receipt_date",
                        "recibo_date",
                    ];
                    for (const campo of camposTributarios) {
                        const valor = invoiceData === null || invoiceData === void 0 ? void 0 : invoiceData[campo];
                        if (valor !== undefined && valor !== null && valor !== "") {
                            updates[campo] = valor;
                        }
                    }
                    if (codigoVerificacao) {
                        updates.code_verif = codigoVerificacao;
                    }
                    await InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates);
                }
                else {
                    console.warn(`[DB] RPS não encontrada: ${numeroRps}`);
                }
            }
            const protocolo = extrairReferenciaLote(Array.isArray(result) ? result[0] : result) ||
                extrairReferenciaLote(resultados[0]) ||
                null;
            return res.status(200).json({
                message: "Lote enviado com sucesso",
                protocolo,
                resultado: result,
            });
        }
        catch (error) {
            console.error("Erro ao enviar lote RPS:", error);
            return res.status(500).json({
                message: "Erro ao enviar lote RPS",
                error: error.message,
            });
        }
    },
    /**
     * Consulta status de uma RPS individual
     * GET /api/nfse/consultar-rps/:rps_number
     */
    async consultarRps(req, res) {
        try {
            const { rps_number } = req.params;
            if (!rps_number) {
                throw new api_errors_1.BadRequestError("Número da RPS não informado");
            }
            const invoice = await InvoiceRepository_1.InvoiceRepository.findByRps_number(rps_number);
            if (!invoice || !invoice.protocolo_lote) {
                return res.status(404).json({
                    message: "RPS não encontrada ou sem protocolo_lote para consulta.",
                });
            }
            let result;
            try {
                result = await focusNfeService.consultarRps(invoice.protocolo_lote);
                const remoteStatus = (result && (result.status || result.Status)) || null;
                const mapped = mapStatus(remoteStatus);
                const codigoVerificacao = extrairCodigoVerificacao(result);
                const urlDanfse = extrairUrlDanfse(result);
                const updates = {};
                if (mapped && mapped !== invoice.status)
                    updates.status = mapped;
                if (urlDanfse && urlDanfse !== invoice.url_danfse)
                    updates.url_danfse = urlDanfse;
                if (codigoVerificacao)
                    updates.code_verif = codigoVerificacao;
                if (Object.keys(updates).length > 0) {
                    await InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates);
                }
            }
            catch (error) {
                if (error.message && error.message.includes("API Error 404")) {
                    return res.status(404).json({
                        message: "Lote não encontrado ou ainda não processado. Aguarde alguns minutos e tente novamente.",
                        error: error.message,
                    });
                }
                return res.status(500).json({
                    message: "Erro ao consultar RPS",
                    error: error.message,
                });
            }
            return res.status(200).json({
                resultado: normalizarStatusFocusNfe(result),
            });
        }
        catch (error) {
            console.error("Erro ao consultar RPS:", error);
            return res.status(500).json({
                message: "Erro ao consultar RPS",
                error: error.message,
            });
        }
    },
    /**
     * Consulta status do lote pelo protocolo
     * GET /api/nfse/consultar-lote/:protocolo
     */
    async consultarLote(req, res) {
        try {
            const { protocolo } = req.params;
            if (!protocolo) {
                throw new api_errors_1.BadRequestError("Protocolo não informado");
            }
            const result = await focusNfeService.consultarLote(protocolo);
            try {
                const handleSingle = async (obj) => {
                    const rpsNum = obj.numero_rps || obj.numero || null;
                    if (!rpsNum)
                        return;
                    const invoice = await InvoiceRepository_1.InvoiceRepository.findByRps_number(String(rpsNum));
                    if (!invoice)
                        return;
                    const mapped = mapStatus(obj.status || obj.Status || null);
                    const urlDanfse = extrairUrlDanfse(obj);
                    const updates = {};
                    if (mapped && mapped !== invoice.status)
                        updates.status = mapped;
                    if (urlDanfse && urlDanfse !== invoice.url_danfse)
                        updates.url_danfse = urlDanfse;
                    const codigoVerificacao = extrairCodigoVerificacao(obj);
                    if (codigoVerificacao)
                        updates.code_verif = codigoVerificacao;
                    if (Object.keys(updates).length > 0) {
                        await InvoiceRepository_1.InvoiceRepository.update(invoice.id, updates);
                    }
                };
                if (Array.isArray(result)) {
                    for (const item of result) {
                        await handleSingle(item);
                    }
                }
                else {
                    await handleSingle(result);
                }
            }
            catch (errUpdate) {
                console.warn("Falha ao atualizar invoice após consulta de lote:", errUpdate);
            }
            return res.status(200).json({
                resultado: normalizarStatusFocusNfe(result),
            });
        }
        catch (error) {
            console.error("Erro ao consultar lote:", error);
            return res.status(500).json({
                message: "Erro ao consultar lote",
                error: error.message,
            });
        }
    },
    /**
     * Cancela uma NFS-e
     * DELETE /api/nfse/:referencia
     * Body: { referencia: string, justificativa: string }
     */
    async cancelarNfse(req, res) {
        try {
            const referencia = req.params.referencia ||
                req.body.referencia ||
                req.body.nfseNumber ||
                req.body.numeroNfse ||
                req.body.protocolo;
            const justificativa = req.body.justificativa ||
                req.body.motivo ||
                req.body.motivo_cancelamento;
            if (!referencia) {
                throw new api_errors_1.BadRequestError("Referência da NFSe não informada");
            }
            if (!justificativa) {
                throw new api_errors_1.BadRequestError("Justificativa do cancelamento não informada");
            }
            const justificativaFormatada = String(justificativa).trim();
            if (justificativaFormatada.length < 15 ||
                justificativaFormatada.length > 255) {
                throw new api_errors_1.BadRequestError("Justificativa deve ter entre 15 e 255 caracteres");
            }
            const invoice = (await InvoiceRepository_1.InvoiceRepository.findByNfs_number(String(referencia).trim())) ||
                (await InvoiceRepository_1.InvoiceRepository.findByRps_number(String(referencia).trim())) ||
                (await InvoiceRepository_1.InvoiceRepository.findByProtocoloLote(String(referencia).trim()));
            const referenciaCancelamento = (invoice === null || invoice === void 0 ? void 0 : invoice.protocolo_lote) || String(referencia).trim();
            if (invoice) {
                const statusNormalizado = String(invoice.status || "").toLowerCase();
                if (statusNormalizado && !["autorizada", "emitida"].includes(statusNormalizado)) {
                    return res.status(400).json({
                        message: "Somente NFS-e autorizadas ou emitidas podem ser canceladas na FocusNFe.",
                        statusAtual: invoice.status,
                    });
                }
                if (!invoice.protocolo_lote && invoice.protocolo_lote !== referenciaCancelamento) {
                    return res.status(400).json({
                        message: "Não foi encontrada a referência da NFSe necessária para cancelar esta nota.",
                    });
                }
            }
            const result = await focusNfeService.cancelarNfse(referenciaCancelamento, justificativaFormatada);
            const retornoStatus = extrairStatusRespostaFocusNfe(result);
            const codigoVerificacao = extrairCodigoVerificacao(result);
            if (invoice && (retornoStatus || codigoVerificacao)) {
                await InvoiceRepository_1.InvoiceRepository.update(invoice.id, Object.assign(Object.assign({}, (retornoStatus && { status: retornoStatus })), (codigoVerificacao && { code_verif: codigoVerificacao })));
            }
            return res.status(200).json({
                message: "NFSe cancelada com sucesso",
                resultado: result,
            });
        }
        catch (error) {
            const apiErrorMatch = String((error === null || error === void 0 ? void 0 : error.message) || "").match(/API Error (\d+):/i);
            if (apiErrorMatch) {
                const apiStatus = Number(apiErrorMatch[1]);
                if (apiStatus === 400 || apiStatus === 404) {
                    return res.status(apiStatus).json({
                        message: error.message,
                    });
                }
            }
            console.error("Erro ao cancelar NFSe:", error);
            return res.status(500).json({
                message: "Erro ao cancelar NFSe",
                error: error.message,
            });
        }
    },
    /**
     * Testa configuração do serviço
     * GET /api/nfse/testar-conexao
     */
    async testarConexao(req, res) {
        try {
            return res.status(200).json({
                message: "Serviço FocusNFE configurado com sucesso",
                ambiente: (process.env.FOCUS_NFE_API_URL || "").includes("homologacao")
                    ? "HOMOLOGAÇÃO"
                    : "PRODUÇÃO",
                prestador: {
                    cnpj: process.env.PRESTADOR_CNPJ,
                    inscricaoMunicipal: process.env.PRESTADOR_IM,
                },
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao verificar configuração",
                error: error.message,
            });
        }
    },
};
//# sourceMappingURL=NfseController.js.map