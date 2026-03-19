# Arquitetura da Integração Focus NFe

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTE / FRONTEND                          │
│              Gera XML (PedidoEnvioLoteRPS)                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              NfseController (HTTP Endpoints)                     │
│                                                                  │
│  POST   /api/nfse/enviar-lote                                  │
│  GET    /api/nfse/consultar-lote/:protocolo                    │
│  POST   /api/nfse/cancelar                                     │
│  GET    /api/nfse/testar-conexao                               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│         getNfseService() → NfseServiceAdapter                   │
│                                                                  │
│  • Lê NFSE_PROVIDER do .env (padrão)                           │
│  • Ou usa provider do request (sobrescreve)                     │
│  • Retorna adapter com provider selecionado                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                ┌─────────┴──────────┐
                ▼                    ▼
       ┌────────────────┐   ┌────────────────────────┐
       │ NfseSpService  │   │   FocusNfeService      │
       │                │   │                        │
       │ (Prefeitura)   │   │   (API REST)           │
       │                │   │                        │
       │ • signXml()    │   │ • converterXml()       │
       │ • calcHash()   │   │ • formatarData()       │
       │ • SOAP call    │   │ • formatarCEP()        │
       │ • SHA-1        │   │ • HTTPS request        │
       │                │   │ • JSON response        │
       └────┬───────────┘   └────┬──────────────────┘
            │                    │
            ▼                    ▼
    ┌──────────────────┐   ┌─────────────────────┐
    │ nfews.prefeitura │   │ api.focusnfe.com.br │
    │ .sp.gov.br       │   │                     │
    │ /lotenfe.asmx    │   │ /v2/nfse            │
    │                  │   │                     │
    │ SOAP Endpoint    │   │ REST API            │
    │ (HTTPS)          │   │ (HTTPS + Token)     │
    └──────────────────┘   └─────────────────────┘
            │                    │
            └────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │   Response (XML/JSON)│
          │                      │
          │ • Protocolo          │
          │ • Status             │
          │ • Erros (se houver)  │
          └──────┬───────────────┘
                 │
                 ▼
          ┌──────────────────────┐
          │ NfseController       │
          │ Serializa resposta   │
          │ e retorna ao cliente │
          └──────────────────────┘
```

---

## Fluxo de Envio XML

### 1️⃣ XML Chega (Prefeitura Format)

```xml
<PedidoEnvioLoteRPS>
  <RPS>
    <InscricaoPrestador>67527655</InscricaoPrestador>
    <NumeroRPS>1</NumeroRPS>
    <SerieRPS>A</SerieRPS>
    <DataEmissao>2025-01-07</DataEmissao>
    <TributacaoRPS>T</TributacaoRPS>
    <StatusRPS>N</StatusRPS>
    <ValorServicos>1000.00</ValorServicos>
    <ValorDeducoes>0.00</ValorDeducoes>
    <ValorPIS>0.00</ValorPIS>
    <ValorCOFINS>0.00</ValorCOFINS>
    <ValorINSS>0.00</ValorINSS>
    <ValorIR>0.00</ValorIR>
    <ValorCSLL>0.00</ValorCSLL>
    <CodigoServico>06298</CodigoServico>
    <AliquotaServicos>3.0</AliquotaServicos>
    <ISSRetido>false</ISSRetido>
    <Discriminacao>Serviço de processamento de dados</Discriminacao>
  </RPS>
</PedidoEnvioLoteRPS>
```

### 2️⃣ Conversor XML → JSON (FocusNfeService)

```javascript
// parseString() converte XML para objeto JavaScript
const xml = "<PedidoEnvioLoteRPS>...</PedidoEnvioLoteRPS>";

parseString(xml, (err, result) => {
  // result.PedidoEnvioLoteRPS.RPS[0] = {
  //   InscricaoPrestador: '67527655',
  //   NumeroRPS: '1',
  //   ...
  // }

  // Mapear para formato Focus NFe
  const focusRequest = {
    referencia: "LOTE-1704713400000",
    prestador: {
      inscricao_municipal: "67527655",
      cnpj: "05668724000121",
    },
    rps: [
      {
        numero: 1,
        serie: "A",
        data_emissao: "2025-01-07",
        status: "Normal",
        tributacao_rps: "T",
        competencia: "2025-01",
        servico: {
          codigo_municipio: "3550308",
          codigo_servico: "06298",
          descricao: "Serviço de processamento de dados",
          aliquota: 3.0,
          valor_servicos: 1000.0,
          valor_pis: 0.0,
          valor_cofins: 0.0,
          valor_inss: 0.0,
          valor_ir: 0.0,
          valor_csll: 0.0,
          valor_deducoes: 0.0,
          valor_issretido: 0.0,
          valor_iss: 30.0,
        },
        tomador: {
          cnpj: "00000000000000",
          cpf: "",
          nome: "Cliente",
          endereco: {
            logradouro: "Rua Exemplo",
            numero: "123",
            bairro: "Centro",
            municipio: "São Paulo",
            estado: "SP",
            cep: "01310-100",
          },
        },
      },
    ],
  };
});
```

### 3️⃣ JSON Vai para Focus NFe

```bash
POST https://api.focusnfe.com.br/v2/nfse?access_token=...

Content-Type: application/json

{
  "referencia": "LOTE-1704713400000",
  "prestador": { ... },
  "rps": [ ... ]
}
```

### 4️⃣ Resposta JSON

```json
{
  "referencia": "LOTE-1704713400000",
  "status": "processando",
  "protocolo": "2025010700000001",
  "numero_nfse": "123456",
  "url_nfse": "https://focus.nfse.com.br/nfse/123456.pdf"
}
```

---

## Seleção de Provider

### Padrão (Environment)

```bash
# .env
NFSE_PROVIDER=focusnfe
# ou
NFSE_PROVIDER=prefeitura
```

```javascript
const nfseService = getNfseService();
// Lê NFSE_PROVIDER do .env automaticamente
```

### Request (Override)

```javascript
// POST /api/nfse/enviar-lote
{
  "xml": "<PedidoEnvioLoteRPS>...",
  "provider": "prefeitura"  // ← Sobrescreve NFSE_PROVIDER
}
```

```javascript
// GET /api/nfse/consultar-lote/LOTE-123?provider=prefeitura
// Query param sobrescreve padrão
```

---

## Decisão de Provider

```typescript
export class NfseServiceAdapter {
  async enviarLoteRps(xml: string): Promise<any> {
    if (this.provider === "prefeitura") {
      console.log("📤 Enviando via Prefeitura...");
      return this.prefeituraService.enviarLoteRps(xml);
    } else {
      console.log("📤 Enviando via Focus NFe...");

      // Converte XML para JSON
      const focusRequest = await this.converterXmlParaFocusNfe(xml);

      // Envia para API
      return await this.fazerRequisicaoApi("POST", "/nfse", focusRequest);
    }
  }
}
```

---

## Ciclo de Vida da Requisição

```
1. Usuário → POST /api/nfse/enviar-lote
   └─ Body: { xml: "...", provider?: "focusnfe" }

2. NfseController.enviarLoteRps()
   └─ Lê provider do body
   └─ Cria adapter: getNfseService()
   └─ Alterna provider se especificado

3. NfseServiceAdapter.enviarLoteRps()
   └─ Verifica this.provider
   └─ Delega para:
      ├─ NfseSpService (se "prefeitura")
      └─ FocusNfeService (se "focusnfe")

4. FocusNfeService.enviarLoteRps()
   ├─ Parse XML: parseString()
   ├─ Converte XML → JSON
   ├─ Formata datas, CEP, códigos
   ├─ HTTPS POST para api.focusnfe.com.br/v2/nfse
   └─ Retorna resposta JSON

5. NfseController retorna ao cliente
   └─ Status: 200 com resultado
   └─ Incluindo provider usado
```

---

## Matriz de Requisições

### Cenário 1: Focus NFe (Padrão)

```
.env: NFSE_PROVIDER=focusnfe

POST /api/nfse/enviar-lote
Body: { "xml": "..." }

↓ Fluxo ↓

getNfseService() → NfseServiceAdapter("focusnfe")
  ↓
FocusNfeService.enviarLoteRps()
  ├─ converterXmlParaFocusNfe()
  ├─ fazerRequisicaoApi("POST", "/nfse")
  └─ POST https://api.focusnfe.com.br/v2/nfse?access_token=...

Response: { "status": "processando", "referencia": "LOTE-..." }
```

### Cenário 2: Prefeitura (Override)

```
.env: NFSE_PROVIDER=focusnfe

POST /api/nfse/enviar-lote
Body: { "xml": "...", "provider": "prefeitura" }

↓ Fluxo ↓

getNfseService() → NfseServiceAdapter("focusnfe")
  ↓
setProvider("prefeitura") → NfseServiceAdapter("prefeitura")
  ↓
NfseSpService.enviarLoteRps()
  ├─ signXml() → Adiciona assinatura digital SHA-1
  ├─ SOAP envelope
  └─ HTTPS POST https://nfews.prefeitura.sp.gov.br/lotenfe.asmx

Response: XML com <RetornoXML><Sucesso>true/false...</Sucesso>...</RetornoXML>
```

---

## Estrutura de Tipos TypeScript

```typescript
// tipos
export type NfseProvider = "prefeitura" | "focusnfe";

export interface INfseService {
  enviarLoteRps(xml: string): Promise<any>;
  consultarLote(numeroProtocolo: string): Promise<any>;
  cancelarNfse(numeroNfse: string, motivo: string): Promise<any>;
}

// Adapter
export class NfseServiceAdapter implements INfseService {
  private provider: NfseProvider;
  private prefeituraService: NfseSpService;
  private focusNfeService: FocusNfeService;

  setProvider(provider: NfseProvider): void { ... }
  getProvider(): NfseProvider { ... }
  async enviarLoteRps(xml: string): Promise<any> { ... }
  async consultarLote(protocolo: string): Promise<any> { ... }
  async cancelarNfse(nfse: string, motivo: string): Promise<any> { ... }
}

// Factory
export function getNfseService(): NfseServiceAdapter {
  const provider = (process.env.NFSE_PROVIDER || "prefeitura") as NfseProvider;
  return new NfseServiceAdapter(provider);
}
```

---

## Fluxo de Transformação de Dados

```
         XML (Prefeitura)
              │
              ▼
    ┌─────────────────────┐
    │  parseString(xml)   │  ← xml2js
    │                     │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Objeto JavaScript       │
    │ {                       │
    │   PedidoEnvioLoteRPS: { │
    │     RPS: [{...}]        │
    │   }                     │
    │ }                       │
    └────────┬────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ Mapear campos:               │
    │ • InscricaoPrestador         │
    │   → prestador.inscricao_municipal
    │ • NumeroRPS → rps.numero    │
    │ • ValorServicos             │
    │   → rps.servico.valor_servicos
    │ etc.                         │
    └────────┬─────────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Formatar:               │
    │ • Datas: DD/MM/YYYY     │
    │   → YYYY-MM-DD          │
    │ • CEP: XXXXX-XXX        │
    │ • Códigos: 5 dígitos    │
    │ • Tributação: Mapear    │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ JSON Focus NFe      │
    │ {                   │
    │   referencia: "..." │
    │   prestador: {...}  │
    │   rps: [{...}]      │
    │ }                   │
    └─────────────────────┘
```

---

## Persistência de Dados

```
Request com XML
    │
    ▼
NfseController
    │
    ├─ Recebe XML
    ├─ Identifica provider
    └─ Delega para adapter
        │
        ▼
    NfseServiceAdapter
        │
        ├─ Se Focus NFe:
        │  └─ Converte XML → JSON
        │  └─ HTTPS POST para Focus
        │  └─ Retorna resposta JSON
        │     • referencia: "LOTE-..."
        │     • status: "processando"
        │     • numero_nfse: "123456"
        │
        └─ Se Prefeitura:
           └─ Assina XML (SHA-1)
           └─ SOAP POST para Prefeitura
           └─ Retorna resposta XML
              • Protocolo: "..."
              • Sucesso: true/false

NfseController
    └─ Serializa resposta
    └─ Retorna JSON ao cliente
       {
         "message": "Lote enviado com sucesso",
         "provider": "focusnfe",
         "protocolo": "LOTE-1704713400000",
         "resultado": {...}
       }
```

---

## Status: ✅ Pronto para Testes

- [x] Arquitectura implementada
- [x] TypeScript compilado (sem erros)
- [x] Fluxos documentados
- [x] Provider switching funcional
- [x] XML converter pronto

**Próximo**: Teste com token Focus NFe real e XML genuíno.
