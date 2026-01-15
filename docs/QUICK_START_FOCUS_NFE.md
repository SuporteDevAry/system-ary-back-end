# Quick Start - Focus NFe Integration

## 30 Segundos para Começar

### 1️⃣ Obtenha o Token

```bash
# Acesse:
https://app.focusnfe.com.br

# Navegue até:
Conta → Integrações → API → Access Token

# Copie o token (formato: alphanumeric_string)
```

### 2️⃣ Configure .env

```bash
nano .env
# ou
code .env
```

Adicione:

```bash
NFSE_PROVIDER=focusnfe
FOCUS_NFE_API_TOKEN=seu_token_aqui
```

Salve e feche.

### 3️⃣ Compile

```bash
npm run build
```

✅ Pronto! Sistema agora usa Focus NFe.

---

## Testar Integração

### Verificar Provider Ativo

```bash
curl http://localhost:3000/api/nfse/testar-conexao?provider=focusnfe

# Resposta esperada:
{
  "message": "Serviço configurado com sucesso",
  "provider": "focusnfe",
  "ambiente": "PRODUÇÃO"
}
```

### Enviar RPS de Teste

```bash
curl -X POST http://localhost:3000/api/nfse/enviar-lote \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<PedidoEnvioLoteRPS>...</seu_xml_aqui></PedidoEnvioLoteRPS>"
  }'
```

### Resposta Esperada

```json
{
  "message": "Lote enviado com sucesso",
  "provider": "focusnfe",
  "protocolo": "LOTE-1704713400000",
  "resultado": {
    "referencia": "LOTE-1704713400000",
    "status": "processando",
    "...": "..."
  }
}
```

---

## Alternar Providers

### Usar Prefeitura (se voltar a funcionar)

**Opção 1 - Padrão**: Mudar .env

```bash
NFSE_PROVIDER=prefeitura
npm run build
```

**Opção 2 - Por Request**: Especificar na chamada

```bash
curl -X POST http://localhost:3000/api/nfse/enviar-lote \
  -d '{"xml":"...", "provider":"prefeitura"}'
```

---

## Troubleshooting

| Problema                              | Solução                                          |
| ------------------------------------- | ------------------------------------------------ |
| "FOCUS_NFE_API_TOKEN não configurado" | Configure `FOCUS_NFE_API_TOKEN` em `.env`        |
| "Erro ao parsear XML"                 | Valide se XML está bem-formado                   |
| "Timeout na requisição"               | Token pode estar expirado, gere novo             |
| "API Error 401"                       | Token inválido, verifique em app.focusnfe.com.br |

---

## Próximas Funcionalidades

- Consultar status: `GET /api/nfse/consultar-lote/:protocolo`
- Cancelar RPS: `POST /api/nfse/cancelar`
- Webhooks para notificações assíncronas

---

## Documentação Completa

Para detalhes técnicos, veja:

- [INTEGRACAO_FOCUS_NFE.md](./INTEGRACAO_FOCUS_NFE.md) - Guia completo
- [STATUS_IMPLEMENTACAO_FOCUS_NFE.md](./STATUS_IMPLEMENTACAO_FOCUS_NFE.md) - Status técnico
- [../src/services/NFSE_ADAPTER_EXAMPLES.ts](../src/services/NFSE_ADAPTER_EXAMPLES.ts) - Exemplos de código

---

**Pronto para usar!** 🚀
