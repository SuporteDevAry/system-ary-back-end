# Integração Focus NFe - Documentação

## Visão Geral

Sistema dual-provider para emissão de NFS-e em São Paulo:

1. **Prefeitura (Padrão)**: Integração direta com webservice da Prefeitura SP
2. **Focus NFe (Fallback)**: Serviço terceirizado enquanto Prefeitura se estabiliza

## Arquitetura

### Adapter Pattern

```
NfseController → getNfseService() → NfseServiceAdapter
                                   ├── NfseSpService (Prefeitura)
                                   └── FocusNfeService (Focus NFe)
```

### Seleção de Provider

Via variável de ambiente `NFSE_PROVIDER`:

- `prefeitura` - Usa integração direta com webservice da Prefeitura SP
- `focusnfe` - Usa API REST da Focus NFe

Pode ser alternado em tempo de execução via query parameter `provider`.

## Configuração

### 1. Adicione ao `.env`:

```bash
# Provider padrão
NFSE_PROVIDER=focusnfe

# Focus NFe
FOCUS_NFE_API_URL=https://api.focusnfe.com.br/v2
FOCUS_NFE_API_TOKEN=seu_token_aqui

# Prefeitura (mantém existente)
PRESTADOR_IM=67527655
PRESTADOR_CNPJ=05668724000121
CERT_PEM_PATH=./certificates/cert.pem
KEY_PEM_PATH=./certificates/key.pem
SOAP_ENDPOINT=https://nfews.prefeitura.sp.gov.br/lotenfe.asmx
```

### 2. Obtenha token Focus NFe

1. Acesse: https://app.focusnfe.com.br
2. Conta → Integrações → API
3. Copie o Access Token
4. Configure em `FOCUS_NFE_API_TOKEN`

## Uso

### Enviar NFS-e via Provider Padrão

```bash
POST /api/nfse/enviar-lote
Content-Type: application/json

{
  "xml": "<PedidoEnvioLoteRPS>...</PedidoEnvioLoteRPS>"
}
```

**Resposta:**

```json
{
  "message": "Lote enviado com sucesso",
  "provider": "focusnfe",
  "protocolo": "LOTE-1704713400000",
  "resultado": { ... }
}
```

### Enviar NFS-e via Provider Específico

```bash
POST /api/nfse/enviar-lote
Content-Type: application/json

{
  "xml": "<PedidoEnvioLoteRPS>...</PedidoEnvioLoteRPS>",
  "provider": "prefeitura"
}
```

### Consultar Status

```bash
GET /api/nfse/consultar-lote/LOTE-1704713400000?provider=focusnfe
```

### Cancelar NFS-e

```bash
POST /api/nfse/cancelar
Content-Type: application/json

{
  "nfseNumber": "123456",
  "motivo": "Erro na emissão",
  "provider": "focusnfe"
}
```

## Fluxo de Conversão XML → Focus NFe

1. **Input**: XML do padrão Prefeitura SP (`<PedidoEnvioLoteRPS>`)
2. **Parsing**: `parseString()` converte XML para objeto JavaScript
3. **Mapeamento**: Campos do RPS são convertidos para formato Focus NFe:
   - `InscricaoPrestador` → `prestador.inscricao_municipal`
   - `ValorServicos` → `rps[].servico.valor_servicos`
   - `TributacaoRPS` → `rps[].tributacao_rps`
   - etc.
4. **Validação**: Formata datas, CEP, códigos de serviço
5. **Output**: JSON com estrutura esperada pela API Focus NFe

### Métodos de Conversão

- `converterXmlParaFocusNfe()` - Converte XML completo
- `formatarData()` - Padroniza datas (YYYY-MM-DD)
- `formatarCEP()` - Formata CEP (XXXXX-XXX)
- `formularCodigo()` - Padroniza código de serviço (5 dígitos)
- `mapearTributacao()` - Mapeia tipo de tributação

## Diferenças entre Providers

### Prefeitura SP

- **Autenticação**: Certificado digital A1
- **Protocolo**: SOAP
- **Assinatura**: SHA-1 + XML Signature
- **Resposta**: XML com campos específicos
- **Modo**: Síncrono (resposta imediata)

### Focus NFe

- **Autenticação**: Token API
- **Protocolo**: REST/JSON
- **Assinatura**: Gerenciada pela API
- **Resposta**: JSON com referência do lote
- **Modo**: Assíncrono (processamento em background)

## Tratamento de Erros

### Prefeitura

```json
{
  "sucesso": false,
  "erros": [
    {
      "codigo": "1206",
      "mensagem": "Assinatura Digital do RPS incorreta"
    }
  ]
}
```

### Focus NFe

```json
{
  "mensagem": "Erro na requisição",
  "status": "erro",
  "erros": [ ... ]
}
```

## Monitoramento

### Logs de Provider

Todos os eventos registram o provider ativo:

```
📨 Enviando via focusnfe...
📤 Processando XML para envio Focus NFe...
✅ XML convertido para formato Focus NFe
✅ Resposta Focus NFe (200):
```

### Verificar Provider Ativo

```bash
GET /api/nfse/testar-conexao
```

Resposta inclui `"provider": "focusnfe"` ou `"provider": "prefeitura"`.

## Migração para Prefeitura (Quando Estabilizar)

Quando a Prefeitura SP reativar seu webservice:

1. **Mude `.env`**:

   ```bash
   NFSE_PROVIDER=prefeitura
   ```

2. **Recompile**:

   ```bash
   npm run build
   ```

3. **Reinicie aplicação**

4. **Teste**:
   ```bash
   GET /api/nfse/testar-conexao
   # Deve retornar: "provider": "prefeitura"
   ```

## Repositórios de Código

### Serviços

- `src/services/NfseServiceAdapter.ts` - Adapter com provider switching
- `src/services/FocusNfeService.ts` - Integração Focus NFe
- `src/services/NfseSpService.ts` - Integração Prefeitura (mantida)

### Controllers

- `src/app/controllers/NfseController.ts` - Endpoints HTTP com suporte a provider switching

### Exemplos

- `src/services/NFSE_ADAPTER_EXAMPLES.ts` - Exemplos de uso do adapter

## Dependências

```json
{
  "xml2js": "^0.6.2",
  "xml-crypto": "^1.4.0",
  "@xmldom/xmldom": "^0.7.13"
}
```

## Troubleshooting

### "FOCUS_NFE_API_TOKEN não configurado"

**Erro**: `FOCUS_NFE_API_TOKEN não configurado. Configure a variável de ambiente.`

**Solução**:

1. Obtenha token em https://app.focusnfe.com.br
2. Configure em `.env`: `FOCUS_NFE_API_TOKEN=seu_token`
3. Reinicie aplicação

### "XML conversion failed"

**Erro**: `Erro ao parsear XML: ...`

**Solução**:

1. Valide XML enviado está bem-formado
2. Verifique se contém tags obrigatórias: `<RPS>`, `<InscricaoPrestador>`, etc.
3. Teste com XML de exemplo

### "Timeout na requisição Focus NFe"

**Erro**: `Timeout na requisição Focus NFe`

**Solução**:

1. Verifique conectividade com api.focusnfe.com.br
2. Token pode estar expirado, obtenha novo
3. Aumente timeout em `FocusNfeService` (padrão: 30s)

## Próximos Passos

- [ ] Implementar retry logic com backoff exponencial
- [ ] Adicionar webhooks para notificação de processamento assíncrono (Focus)
- [ ] Dashboard com status de ambos os providers
- [ ] Testes end-to-end com XML real
- [ ] Documentação de API (OpenAPI/Swagger)

## Contato

Para issues ou dúvidas sobre integração Focus NFe:

- Support Focus: https://suporte.focusnfe.com.br
- Documentação API: https://doc.focusnfe.com.br
