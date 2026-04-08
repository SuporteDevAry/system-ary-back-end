# Troubleshooting - Erro 401 Focus NFe

## Problema: HTTP 401 - Access Denied

```
❌ Erro ao enviar para Focus NFe: Error: Erro ao parsear resposta: HTTP Basic: Access denied.
```

## Causas Possíveis

### 1. Token Expirado ⏰

- Tokens Focus NFe têm validade limitada
- **Solução**: Gere um novo token

### 2. Token Inválido 🔑

- Token pode ter sido corrompido na cópia/cola
- Espaços em branco extras
- Caracteres especiais mal interpretados
- **Solução**: Copie novamente com cuidado

### 3. Conta sem Permissão ❌

- Conta não ativada para API
- Sem permissão para enviar NFS-e
- **Solução**: Verifique na conta se API está liberada

### 4. Ambiente Errado 🌐

- Token é de produção, mas .env aponta para homologação
- Token é de homologação, mas .env aponta para produção
- **Solução**: Certifique-se que estão alinhados

## Passo a Passo - Gerar Novo Token

### 1. Acesse o Portal

```
https://app.focusnfe.com.br
```

### 2. Faça Login

- CPF/CNPJ: seu_documento
- Senha: sua_senha

### 3. Navegue até Integrações

```
Canto Superior Direito
    ↓
Meu Perfil (ou Conta)
    ↓
Integrações
    ↓
API
```

### 4. Copie o Token

- **Homologação**: Copie o "Access Token" da seção de teste
- **Produção**: Copie o "Access Token" da seção de produção

### 5. Configure no .env

**Para Homologação**:

```bash
FOCUS_NFE_API_URL=https://homologacao.focusnfe.com.br/v2
FOCUS_NFE_API_TOKEN=seu_novo_token_homologacao
```

**Para Produção**:

```bash
FOCUS_NFE_API_URL=https://api.focusnfe.com.br/v2
FOCUS_NFE_API_TOKEN=seu_novo_token_producao
```

### 6. Reinicie o Servidor

```bash
# Pare o servidor (Ctrl+C)
# Compile novamente
npm run build
# Inicie
npm run dev
```

## Verificação de Debug

Quando iniciar o servidor, você deve ver:

```
✅ FocusNfeService inicializado
   API URL: https://homologacao.focusnfe.com.br/v2
   Token configurado: Rr5el...hV1EY
   Ambiente: HOMOLOGAÇÃO
```

Se o token estiver vazio:

```
❌ FOCUS_NFE_API_TOKEN não configurado
```

## Testar Token com cURL

Você pode testar o token diretamente:

```bash
curl -X GET "https://homologacao.focusnfe.com.br/v2/status?access_token=SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Resposta esperada (200)**:

```json
{
  "status": "ok",
  "message": "API está funcionando"
}
```

**Resposta com erro (401)**:

```json
{
  "status": "erro",
  "message": "Access denied"
}
```

## Contato Focus NFe

Se o problema persistir:

1. **Chat de Suporte**: https://app.focusnfe.com.br
   - Ícone de chat no canto inferior direito
2. **Email**: suporte@focusnfe.com.br

3. **Status Page**: https://status.focusnfe.com.br

   - Verific se há problemas no serviço

4. **Documentação**: https://doc.focusnfe.com.br

## Checklist de Verificação

- [ ] Token foi copiado SEM espaços extras
- [ ] Token está correto em `.env`
- [ ] URL de homologação corresponde ao token de homologação
- [ ] URL de produção corresponde ao token de produção
- [ ] Servidor foi reiniciado após mudar .env
- [ ] npm run build foi executado
- [ ] Conta foi criada e ativada para API
- [ ] Token não está expirado

## Logs Úteis para Debug

Quando enviar RPS, observe:

```
✅ FocusNfeService inicializado
   API URL: https://homologacao.focusnfe.com.br/v2
   Token configurado: Rr5el...hV1EY
   Ambiente: HOMOLOGAÇÃO

📨 Enviando via focusnfe...
🔗 Requisição Focus NFe:
   Método: POST
   URL: homologacao.focusnfe.com.br/v2/nfse?access_token=Rr5el...

✅ Resposta Focus NFe (401):
❌ ERRO DE AUTENTICAÇÃO 401:
   Token pode estar expirado ou inválido
   Verifique em: https://app.focusnfe.com.br -> Conta -> Integrações -> API
```

Se aparecer este erro, o token definitivamente está inválido.

---

**Próximas ações**:

1. Gere um novo token no portal
2. Atualize o .env
3. Reinicie o servidor
4. Teste novamente
