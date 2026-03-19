# Mudanças Necessárias no Frontend - Reforma Tributária v02

## 🚨 **ATUALIZAÇÃO IMPORTANTE - 06/01/2026**

⚠️ **A Reforma Tributária FOI ADIADA pela Prefeitura!**

Apesar dos anúncios oficiais, o webservice de produção **AINDA NÃO FOI ATUALIZADO** para aceitar o schema v02.

### Status Atual:

- ❌ **Versao="2"** é **REJEITADA** pelo webservice
- ❌ **InfoComplementares** não é reconhecido
- ✅ **Versao="1"** continua sendo o **PADRÃO OBRIGATÓRIO**

### Erros ao usar v02:

```
Erro 1001: XML não compatível com Schema.
The value of the 'Versao' attribute does not equal its fixed value.

Erro 1001: XML não compatível com Schema.
The element 'RPS' has invalid child element 'InfoComplementares'.
```

**📄 Consulte**: [AVISO-REFORMA-TRIBUTARIA-NAO-ATIVA.md](AVISO-REFORMA-TRIBUTARIA-NAO-ATIVA.md) para mais detalhes.

---

## ✅ CONFIGURAÇÃO ATUAL (OBRIGATÓRIA)

### Arquivo: `Invoice.tsx`

**MANTER como está:**

```typescript
// ✅ CORRETO - Usar até a Prefeitura ativar a Reforma Tributária
xml += `<Cabecalho Versao="1" xmlns="">`;
```

**❌ NÃO ALTERAR para:**

```typescript
// ❌ INCORRETO - Prefeitura rejeita (por enquanto)
xml += `<Cabecalho Versao="2" xmlns="">`;
```

---

## 🔄 Quando a Prefeitura Ativar a Reforma Tributária

### Mudança NECESSÁRIA no Frontend:

**Linha a ser modificada:**

```typescript
// ❌ ANTES (INCORRETO - versão antiga)
xml += `<Cabecalho Versao="1" xmlns="">`;

// ✅ DEPOIS (CORRETO - Reforma Tributária)
xml += `<Cabecalho Versao="2" xmlns="">`;
```

### Localização no código:

Procure por esta linha no método `gerarXML()`:

```typescript
const gerarXML = () => {
  // ...

  // ✅ IMPORTANTE: Mudar de Versao="1" para Versao="2"
  xml += `<Cabecalho Versao="2" xmlns="">`;
  xml += `<CPFCNPJRemetente><CNPJ>${PRESTADOR.CNPJ}</CNPJ></CPFCNPJRemetente>`;
  // ...
};
```

## ✅ O que o Backend já faz automaticamente

Você **NÃO precisa** adicionar manualmente no frontend:

### 1. InfoComplementares

O backend adiciona automaticamente para cada RPS:

- `cClassTrib` (Código de Classificação Tributária)
- `CST` (Código de Situação Tributária)
- `cNBS` (Código NBS)
- `dhEmissao` (Data/hora de emissão)
- `tpEmissao` (Tipo de emissão)
- `verProc` (Versão do processo)

### 2. Valores de IBS e CBS

O backend calcula automaticamente:

- `vBCIBS` (Base de cálculo IBS)
- `pAliqIBS` (Alíquota IBS: 2,5%)
- `vIBS` (Valor IBS)
- `vBCCBS` (Base de cálculo CBS)
- `pAliqCBS` (Alíquota CBS: 2,5%)
- `vCBS` (Valor CBS)

### 3. Local de Prestação

O backend adiciona automaticamente:

- `cMunIncid` (Código do município)
- `UF` (Estado)

## 🔧 Valores Padrão Utilizados pelo Backend

| Campo        | Valor Padrão     | Descrição                |
| ------------ | ---------------- | ------------------------ |
| `cClassTrib` | `"01"`           | Classificação Tributária |
| `CST`        | `"00"`           | Tributação Normal        |
| `cNBS`       | `"1.0101.00.00"` | Código NBS genérico      |
| `pAliqIBS`   | `"2.50"`         | Alíquota IBS (2,5%)      |
| `pAliqCBS`   | `"2.50"`         | Alíquota CBS (2,5%)      |
| `cMunIncid`  | `"3550308"`      | São Paulo/SP             |
| `UF`         | `"SP"`           | São Paulo                |
| `tpEmissao`  | `"1"`            | Emissão Normal           |
| `verProc`    | `"1.0.0"`        | Versão do sistema        |

## 📊 Exemplo de XML Gerado

### Frontend envia (simplificado):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<PedidoEnvioLoteRPS xmlns="http://www.prefeitura.sp.gov.br/nfe">
  <Cabecalho Versao="2" xmlns="">
    <!-- ... -->
  </Cabecalho>
  <RPS xmlns="">
    <Assinatura></Assinatura>
    <ChaveRPS>...</ChaveRPS>
    <ValorServicos>10.00</ValorServicos>
    <!-- ... outros campos ... -->
    <Discriminacao>SERVICO DE TESTE</Discriminacao>
  </RPS>
</PedidoEnvioLoteRPS>
```

### Backend adiciona automaticamente:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<PedidoEnvioLoteRPS xmlns="http://www.prefeitura.sp.gov.br/nfe">
  <Cabecalho Versao="2" xmlns="">
    <!-- ... -->
  </Cabecalho>
  <RPS xmlns="">
    <Assinatura>ABC123...</Assinatura> <!-- Backend preenche -->
    <ChaveRPS>...</ChaveRPS>
    <ValorServicos>10.00</ValorServicos>
    <!-- ... outros campos ... -->
    <Discriminacao>SERVICO DE TESTE</Discriminacao>

    <!-- ✅ Backend adiciona automaticamente: -->
    <InfoComplementares>
      <cClassTrib>01</cClassTrib>
      <cEnqTribCoop></cEnqTribCoop>
      <dhEmissao>2026-01-06T10:30:45</dhEmissao>
      <tpEmissao>1</tpEmissao>
      <verProc>1.0.0</verProc>
      <infServ>
        <CST>00</CST>
        <cNBS>1.0101.00.00</cNBS>
        <vServPrest>10.00</vServPrest>
        <vBC>10.00</vBC>
        <pAliq>5.00</pAliq>
        <vTributo>0.50</vTributo>
        <vBCIBS>10.00</vBCIBS>
        <pAliqIBS>2.50</pAliqIBS>
        <vIBS>0.25</vIBS>
        <vBCCBS>10.00</vBCCBS>
        <pAliqCBS>2.50</pAliqCBS>
        <vCBS>0.25</vCBS>
      </infServ>
      <infLocalPrest>
        <cMunIncid>3550308</cMunIncid>
        <UF>SP</UF>
      </infLocalPrest>
    </InfoComplementares>
  </RPS>
  <!-- Backend adiciona assinatura XMLDSig -->
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <!-- ... -->
  </Signature>
</PedidoEnvioLoteRPS>
```

## 🚀 Resumo das Ações

### Frontend:

1. ✅ **Mudar** `Versao="1"` para `Versao="2"` no Cabecalho
2. ✅ **Enviar** o XML para o backend normalmente
3. ✅ **Não precisa** adicionar campos de IBS/CBS manualmente

### Backend (já implementado):

1. ✅ Verifica versão do Cabecalho e atualiza se necessário
2. ✅ Adiciona InfoComplementares em cada RPS que não tenha
3. ✅ Preenche assinaturas SHA-1 de cada RPS
4. ✅ Assina o XML completo com XMLDSig
5. ✅ Envia para a Prefeitura

## 📚 Referências

- **Manual WebService v3.3.4**: https://notadomilhao.sf.prefeitura.sp.gov.br/manuais/
- **Documentação Reforma Tributária**: https://notadomilhao.sf.prefeitura.sp.gov.br/reforma-tributaria/
- **Schemas XSD v02**: https://notadomilhao.sf.prefeitura.sp.gov.br/wp-content/uploads/2025/10/schemas-reformatributaria-v02-2.zip

## ⚠️ Observações Importantes

1. **Data de vigência**: Reforma Tributária obrigatória desde **01/01/2026**
2. **Layout antigo (v01)**: Não é mais aceito pela Prefeitura
3. **Valores de IBS/CBS**: São calculados automaticamente pelo backend usando as alíquotas padrão (2,5% cada)
4. **Código NBS**: Backend usa código genérico `1.0101.00.00` - ajustar posteriormente conforme necessidade

## 🐛 Troubleshooting

### Erro 1204: "Valor Total de Serviços não confere"

- **Causa**: XML com Versao="1" ou sem InfoComplementares
- **Solução**: Atualizar frontend para Versao="2" - backend resolve o resto

### Erro 1206: "Assinatura Digital do RPS incorreta"

- **Causa**: Estrutura XML incorreta ou campos faltando
- **Solução**: Backend agora adiciona todos os campos necessários automaticamente

---

**✅ Aplicando apenas a mudança de `Versao="1"` para `Versao="2"`, o sistema ficará totalmente compatível com a Reforma Tributária!**
