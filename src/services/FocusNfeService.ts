/**
 * Integração com API Focus NFe para envio de NFS-e
 * Documentação: https://doc.focusnfe.com.br/reference/enviarnfse
 *
 * Permite enviar NFS-e para prefeitura via serviço terceirizado
 * Mantém os mesmos métodos que NfseSpService para compatibilidade
 */

import https from "https";
import { parseString } from "xml2js";

interface FocusNfeConfig {
  apiUrl: string;
  apiToken: string;
  timeout: number;
}

interface FocusNfeRequest {
  referencia: string;
  data_emissao: string;
  prestador: {
    cnpj?: string;
    cpf?: string;
    inscricao_municipal: string;
    codigo_municipio: string;
  };
  tomador: {
    cpf?: string;
    cnpj?: string;
    razao_social: string;
    email?: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      codigo_municipio: string;
      uf: string;
      cep: string;
    };
  };
  servico: {
    valor_servicos: number;
    valor_deducoes?: number;
    iss_retido: boolean;
    valor_iss?: number;
    base_calculo?: number;
    aliquota: number;
    desconto_incondicionado?: number;
    desconto_condicionado?: number;
    item_lista_servico: string;
    codigo_cnae?: string;
    codigo_tributario_municipio?: string;
    discriminacao: string;
    codigo_municipio: string;
  };
}

export class FocusNfeService {
  private config: FocusNfeConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.FOCUS_NFE_API_URL || "https://api.focusnfe.com.br/v2",
      apiToken: process.env.FOCUS_NFE_API_TOKEN || "",
      timeout: 30000,
    };

    if (!this.config.apiToken) {
      throw new Error(
        "FOCUS_NFE_API_TOKEN não configurado. Configure a variável de ambiente."
      );
    }

    console.log("✅ FocusNfeService inicializado");
    console.log(`   API URL: ${this.config.apiUrl}`);
    console.log(
      `   Token configurado: ${this.config.apiToken.substring(
        0,
        5
      )}...${this.config.apiToken.substring(this.config.apiToken.length - 5)}`
    );

    // Detectar se está em homologação
    const isHomolog = this.config.apiUrl.includes("homologacao");
    console.log(`   Ambiente: ${isHomolog ? "HOMOLOGAÇÃO" : "PRODUÇÃO"}`);
  }

  /**
   * Envia lote de RPS via API Focus NFe
   * Aceita XML gerado pelo frontend e o processa
   */
  async enviarLoteRps(xml: string): Promise<any> {
    try {
      console.log("📤 Processando XML para envio Focus NFe...");

      const focusRequest = await this.converterXmlParaFocusNfe(xml);
      console.log("✅ XML convertido para formato Focus NFe");

      // Gera referência única para o lote
      const referencia = focusRequest.referencia;
      const { referencia: _ref, ...body } = focusRequest as any;

      return await this.fazerRequisicaoApi(
        "POST",
        `/nfse?ref=${referencia}`,
        body
      );
    } catch (error: any) {
      console.error("❌ Erro ao enviar para Focus NFe:", error);
      throw new Error(`Falha no envio: ${error.message}`);
    }
  }

  /**
   * Consulta status de NFS-e na Focus NFe
   */
  async consultarLote(numeroProtocolo: string): Promise<any> {
    try {
      console.log(`🔍 Consultando NFS-e ${numeroProtocolo} na Focus NFe...`);

      return await this.fazerRequisicaoApi("GET", `/nfse/${numeroProtocolo}`);
    } catch (error: any) {
      console.error("❌ Erro ao consultar Focus NFe:", error);
      throw new Error(`Falha na consulta: ${error.message}`);
    }
  }

  /**
   * Cancela NFS-e na Focus NFe
   */
  async cancelarNfse(numeroNfse: string, motivo: string): Promise<any> {
    try {
      console.log(`❌ Cancelando NFS-e ${numeroNfse} na Focus NFe...`);

      const payload = {
        pedido_numero_nfse: numeroNfse,
        motivo_cancelamento: motivo,
      };

      return await this.fazerRequisicaoApi(
        "POST",
        `/nfse/${numeroNfse}/cancelamento`,
        payload
      );
    } catch (error: any) {
      console.error("❌ Erro ao cancelar NFS-e na Focus NFe:", error);
      throw new Error(`Falha no cancelamento: ${error.message}`);
    }
  }

  /**
   * Faz requisição genérica para a API Focus NFe
   */
  private fazerRequisicaoApi(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    payload?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(this.config.apiUrl + endpoint);

      console.log(`\n🔗 Requisição Focus NFe:`);
      console.log(`   Método: ${method}`);
      console.log(`   URL: ${url.hostname}${url.pathname}${url.search}`);

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

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // DEBUG: Log do payload enviado para diagnóstico
          if (payload) {
            console.log(
              "\n🔍 DEBUG - Payload EXATO enviado no corpo da requisição:"
            );
            console.log(JSON.stringify(payload, null, 2));
          }

          console.log(`\n✅ Resposta Focus NFe (${res.statusCode}):`);

          // Se status é 401, mensagem de erro de autenticação
          if (res.statusCode === 401) {
            console.error("❌ ERRO DE AUTENTICAÇÃO 401:");
            console.error("   Token pode estar expirado ou inválido");
            console.error(
              "   Verifique em: https://app.focusnfe.com.br -> Conta -> Integrações -> API"
            );
            console.error("   Resposta recebida:", data);
            reject(
              new Error(
                "Autenticação falhou (401). Verifique o token FOCUS_NFE_API_TOKEN."
              )
            );
            return;
          }

          try {
            const response = JSON.parse(data);
            console.log(JSON.stringify(response, null, 2));

            if (
              res.statusCode &&
              res.statusCode >= 200 &&
              res.statusCode < 300
            ) {
              resolve(response);
            } else {
              reject(
                new Error(
                  `API Error ${res.statusCode}: ${
                    response.mensagem || response.message || "Unknown error"
                  }`
                )
              );
            }
          } catch (e) {
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
  private async converterXmlParaFocusNfe(
    xml: string
  ): Promise<FocusNfeRequest> {
    return new Promise((resolve, reject) => {
      parseString(xml, { explicitArray: false }, (err: any, result: any) => {
        if (err) {
          reject(new Error(`Erro ao parsear XML: ${err.message}`));
          return;
        }

        try {
          const pedido = result.PedidoEnvioLoteRPS;
          const cabecalho = pedido.Cabecalho || {};

          // Extrai dados do prestador
          const rpsArray = Array.isArray(pedido.RPS)
            ? pedido.RPS
            : [pedido.RPS];
          const primeiroRps = rpsArray[0];

          // DEBUG: Log completo da estrutura do primeiro RPS
          console.log("🔍 DEBUG - Estrutura completa do RPS recebida:");
          console.log(JSON.stringify(primeiroRps, null, 2));

          // InscricaoPrestador está dentro de ChaveRPS no XML
          const chaveRps = primeiroRps.ChaveRPS || {};
          const inscricaoPrestador =
            chaveRps.InscricaoPrestador || primeiroRps.InscricaoPrestador || "";

          // Extrai CNPJ/CPF do prestador a partir do Cabecalho (onde o frontend envia)
          const cpfCnpjRemetente = cabecalho.CPFCNPJRemetente || {};
          const cnpjPrestador =
            cpfCnpjRemetente.CNPJ ||
            primeiroRps.CNPJRemetente ||
            primeiroRps.CNPJ ||
            process.env.CNPJ_PRESTADOR ||
            "";
          const cpfPrestador =
            cpfCnpjRemetente.CPF ||
            primeiroRps.CPFRemetente ||
            primeiroRps.CPF ||
            process.env.CPF_PRESTADOR ||
            "";

          // Log para debug
          console.log(`   📋 Extração Prestador:`);
          console.log(`      IM: ${inscricaoPrestador || "✗ não encontrado"}`);
          console.log(
            `      CNPJ: ${cnpjPrestador ? "✓ fornecido" : "✗ não fornecido"}`
          );
          console.log(
            `      CPF: ${cpfPrestador ? "✓ fornecido" : "✗ não fornecido"}`
          );

          // Extrai dados do tomador a partir do primeiro RPS
          const rps = primeiroRps;
          const cpfCnpjTomador = rps.CPFCNPJTomador || {};
          const enderecTomador = rps.EnderecoTomador || {};
          const cnpjTomador = cpfCnpjTomador.CNPJ || "";
          const cpfTomador = cpfCnpjTomador.CPF || "";
          const razaoSocialTomador =
            rps.RazaoSocialTomador || rps.NomeFantasia || "Cliente";
          const emailTomador = rps.EmailTomador || "";

          const codigoMunicipioServico = rps.MunicipioPrestacao || "3550308";
          const codigoMunicipioTomadorOriginal =
            enderecTomador.Cidade || codigoMunicipioServico;
          const codigoMunicipioTomadorCorrigido =
            this.validarECorrigirCodigoMunicipio(
              codigoMunicipioTomadorOriginal,
              enderecTomador.UF || "SP",
              enderecTomador.CEP || ""
            );

          const valorServicos = parseFloat(rps.ValorServicos) || 0;
          const aliquotaFracao = parseFloat(rps.AliquotaServicos) || 0;
          const aliquotaPercentual =
            Math.round(aliquotaFracao * 100 * 100) / 100;
          const valorIss = valorServicos * aliquotaFracao;

          // Monta a requisição final
          const prestadorObj: any = {
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
            throw new Error(
              "Prestador sem CNPJ nem CPF. Configure CNPJ_PRESTADOR ou CPF_PRESTADOR em .env"
            );
          }

          // Define cTribMun (3 dígitos) via env override quando disponível
          const codigoTribMun = this.deriveCodigoTributarioMunicipio();

          const focusRequest: FocusNfeRequest = {
            referencia: `LOTE-${Date.now()}`,
            data_emissao: this.formatarData(rps.DataEmissao),
            prestador: {
              ...(cnpjPrestador && { cnpj: cnpjPrestador }),
              ...(cpfPrestador && { cpf: cpfPrestador }),
              inscricao_municipal: inscricaoPrestador,
              codigo_municipio: String("3550308"),
            },
            tomador: {
              ...(cnpjTomador && { cnpj: cnpjTomador }),
              ...(cpfTomador && { cpf: cpfTomador }),
              razao_social: razaoSocialTomador,
              ...(emailTomador && { email: emailTomador }),
              endereco: {
                logradouro: enderecTomador.Logradouro || "",
                numero: enderecTomador.NumeroEndereco || "S/N",
                ...(enderecTomador.ComplementoEndereco && {
                  complemento: enderecTomador.ComplementoEndereco,
                }),
                bairro: enderecTomador.Bairro || "",
                codigo_municipio: String(codigoMunicipioTomadorCorrigido),
                uf: enderecTomador.UF || "SP",
                cep: this.formatarCEP(enderecTomador.CEP),
              },
            },
            servico: {
              valor_servicos: valorServicos,
              ...(parseFloat(rps.ValorDeducoes) > 0 && {
                valor_deducoes: parseFloat(rps.ValorDeducoes),
              }),
              iss_retido: rps.ISSRetido === "true",
              valor_iss: valorIss,
              aliquota: aliquotaPercentual,
              item_lista_servico: this.deriveItemListaServico(rps),
              ...(codigoTribMun && {
                codigo_tributario_municipio: codigoTribMun,
              }),
              discriminacao: rps.Discriminacao || "Serviço não especificado",
              codigo_municipio: String(codigoMunicipioServico),
            },
          };

          console.log("✅ Conversão XML → Focus NFe concluída");

          // DEBUG: Log COMPLETO da requisição que será enviada
          console.log(
            "\n🔍 DEBUG - PAYLOAD COMPLETO que será enviado para API:"
          );
          console.log(JSON.stringify(focusRequest, null, 2));

          resolve(focusRequest);
        } catch (error: any) {
          reject(new Error(`Erro ao converter RPS: ${error.message}`));
        }
      });
    });
  }

  /**
   * Formata data de DD/MM/YYYY (padrão brasileiro) para YYYY-MM-DD (ISO)
   * Corrige automaticamente datas invertidas (dia/mês trocados)
   */
  private formatarData(data: string): string {
    if (!data) return new Date().toISOString().split("T")[0];

    // Se já está no formato YYYY-MM-DD, valida se não está com dia/mês invertidos
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [ano, mes, dia] = data.split("-");
      const dataObj = new Date(`${ano}-${mes}-${dia}T12:00:00`);
      const hoje = new Date();

      // Se a data é futura (mais de 30 dias à frente), pode estar invertida
      const diffDias = Math.floor(
        (dataObj.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDias > 30 && parseInt(mes) > 12) {
        // Mês impossível, está claramente invertido
        console.warn(
          `⚠️  Data com mês inválido detectada: ${data}, invertendo para ${ano}-${dia}-${mes}`
        );
        return `${ano}-${dia.padStart(2, "0")}-${mes.padStart(2, "0")}`;
      }

      if (
        diffDias > 30 &&
        parseInt(dia) <= 12 &&
        parseInt(mes) > parseInt(dia)
      ) {
        // Data no futuro distante + dia <= 12 + mês > dia = provável inversão
        console.warn(
          `⚠️  Data futura detectada: ${data}, invertendo dia/mês para ${ano}-${dia}-${mes}`
        );
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
  private mapearTributacao(tributacao: string): "T" | "F" | "C" | "N" {
    const mapa: { [key: string]: "T" | "F" | "C" | "N" } = {
      T: "T", // Tributado
      F: "F", // Não tributável
      C: "C", // Cancelado
      N: "N", // Nenhum
    };
    return mapa[tributacao] || "T";
  }

  /**
   * Extrai competência (ano-mês) da data
   */
  private extrairCompetencia(data: string): string {
    const dataFormatada = this.formatarData(data);
    return dataFormatada.substring(0, 7); // YYYY-MM
  }

  /**
   * Formata código de serviço com zeros à esquerda
   */
  private formularCodigo(codigo: string): string {
    if (!codigo) return "06298"; // Padrão: Serviços de processamento de dados
    return codigo.padStart(5, "0");
  }

  /**
   * Extrai CNPJ do RPS
   */
  private extrairCNPJ(rps: any): string {
    return rps.CNPJTomador || rps.CNPJ || "";
  }

  /**
   * Extrai CPF do RPS
   */
  private extrairCPF(rps: any): string {
    return rps.CPFTomador || rps.CPF || "";
  }

  /**
   * Retorna nome do município baseado no código
   */
  private extrairMunicipioNome(cidade: string): string {
    // Simplificado: retorna o valor recebido ou padrão
    return cidade || "São Paulo";
  }

  /**
   * Converte código IBGE de município para nome
   * Mapeamento dos códigos mais comuns
   */
  private obterNomeMunicipio(codigoIbge: string): string {
    const municipios: { [key: string]: string } = {
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
  private validarECorrigirCodigoMunicipio(
    codigoIbgeOriginal: string,
    uf: string,
    cep: string
  ): string {
    // Mapa: UF → Prefixo IBGE esperado (primeiros 2 dígitos)
    const ufParaPrefixoIBGE: { [key: string]: string } = {
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
    const cepParaIBGE: { [key: string]: string } = {
      "90460": "4314902", // Porto Alegre/RS
      "01310": "3550308", // São Paulo/SP
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
      console.warn(
        `⚠️  AVISO: Código IBGE ${codigoIbgeOriginal} não bate com UF ${uf}`
      );
      console.warn(
        `   IBGE esperado começa com: ${prefixoIBGEEsperado}, mas recebido: ${prefixoIBGEOriginal}`
      );
      console.warn(`   Usando UF ${uf} com IBGE padrão`);

      // Retorna um IBGE válido baseado no UF
      // Para simplicidade, usa o primeiro código válido do estado
      const codigoPadraoUF: { [key: string]: string } = {
        SP: "3550308", // São Paulo
        RS: "4314902", // Porto Alegre
        RJ: "3304557", // Rio de Janeiro
      };

      return codigoPadraoUF[uf] || "3550308";
    }

    return codigoIbgeOriginal;
  }

  /**
   * Formata CEP para XXXXX-XXX
   */
  private formatarCEP(cep: string): string {
    if (!cep) return "";

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
  private deriveItemListaServico(rps: any): string {
    const codigoServico = (rps.CodigoServico || "").toString();
    const discr = (rps.Discriminacao || "").toLowerCase();

    if (codigoServico === "06298") return "010700";
    if (discr.includes("intermedia")) return "010700";

    // Ajuste futuro: permitir override via env FOCUS_ITEM_LISTA_SERVICO
    const envOverride = process.env.FOCUS_ITEM_LISTA_SERVICO;
    if (envOverride && /^[0-9]{6}$/.test(envOverride)) return envOverride;

    return "010700";
  }

  /**
   * Deriva cTribMun (código tributário municipal) com 3 dígitos [0-9]{3}.
   * A Focus/NFSe Nacional exige padrão de 3 dígitos. Caso não seja conhecido,
   * omite o campo para evitar erros de schema.
   * Pode ser configurado via env FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO.
   */
  private deriveCodigoTributarioMunicipio(): string | null {
    const env = process.env.FOCUS_CODIGO_TRIBUTARIO_MUNICIPIO;
    if (env && /^[0-9]{3}$/.test(env)) {
      return env;
    }
    return null;
  }
}
