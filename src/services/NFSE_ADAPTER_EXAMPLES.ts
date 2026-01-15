/**
 * Exemplo de como usar o NfseServiceAdapter nos controllers
 * Permite alternar entre Prefeitura e Focus NFe facilmente
 */

import { getNfseService } from "../services/NfseServiceAdapter";

// ============= EXEMPLO DE USO =============

/**
 * OPÇÃO 1: Usar a configuração padrão (definida por NFSE_PROVIDER no .env)
 */
export async function enviarNfseComConfigPadrao(xml: string) {
  const nfseService = getNfseService();
  
  console.log(`📨 Provider ativo: ${nfseService.getProvider()}`);
  
  const resultado = await nfseService.enviarLoteRps(xml);
  return resultado;
}

/**
 * OPÇÃO 2: Alterar provider em tempo de execução
 */
export async function enviarNfseComFocusNfe(xml: string) {
  const nfseService = getNfseService();
  
  // Alterna para Focus NFe
  nfseService.setProvider("focusnfe");
  
  console.log(`📨 Usando: ${nfseService.getProvider()}`);
  
  const resultado = await nfseService.enviarLoteRps(xml);
  return resultado;
}

/**
 * OPÇÃO 3: Usar diretamente a Prefeitura
 */
export async function enviarNfseDiretaPrefeitura(xml: string) {
  const nfseService = getNfseService();
  
  // Garante que está usando Prefeitura
  nfseService.setProvider("prefeitura");
  
  console.log(`📨 Usando: ${nfseService.getProvider()}`);
  
  const resultado = await nfseService.enviarLoteRps(xml);
  return resultado;
}

/**
 * OPÇÃO 4: Exemplo em um Controller/Route
 */
export async function emitirNfseHandler(req: any, res: any) {
  try {
    const { xml, provider } = req.body;

    // Validar XML
    if (!xml) {
      return res.status(400).json({ erro: "XML não fornecido" });
    }

    // Criar serviço
    const nfseService = getNfseService();

    // Se foi especificado um provider, usar esse
    if (provider) {
      nfseService.setProvider(provider);
    }

    console.log(
      `\n🔄 Emitindo NFS-e com provider: ${nfseService.getProvider()}\n`
    );

    // Enviar
    const resultado = await nfseService.enviarLoteRps(xml);

    res.json({
      sucesso: true,
      provider: nfseService.getProvider(),
      resultado: resultado,
    });
  } catch (error: any) {
    res.status(500).json({
      sucesso: false,
      erro: error.message,
    });
  }
}

// ============= CONFIGURAÇÃO .env =============

/*
# Definir qual provider usar por padrão
# Opções: "prefeitura" ou "focusnfe"
NFSE_PROVIDER=focusnfe

# Configuração Focus NFe
FOCUS_NFE_API_URL=https://api.focusnfe.com.br/v2
FOCUS_NFE_API_TOKEN=seu_token_aqui

# Configuração Prefeitura SP (já existente)
PRESTADOR_IM=67527655
PRESTADOR_CNPJ=05668724000121
CERT_PEM_PATH=./certificates/cert.pem
KEY_PEM_PATH=./certificates/key.pem
WSDL_URL=https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx?wsdl
SOAP_ENDPOINT=https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx
*/
