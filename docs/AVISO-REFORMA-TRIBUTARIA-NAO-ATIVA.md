# ⚠️ AVISO IMPORTANTE: Reforma Tributária NÃO Implementada pela Prefeitura

**Data**: 06 de Janeiro de 2026  
**Status**: ❌ **REFORMA TRIBUTÁRIA AINDA NÃO ATIVA NO WEBSERVICE**

## 🚨 Situação Atual

Apesar dos **anúncios oficiais** da Prefeitura de São Paulo sobre a Reforma Tributária estar em vigor desde **01/01/2026**, o **webservice de produção AINDA NÃO FOI ATUALIZADO**.

### Evidências

#### Tentativa de Envio com Schema v02:

```
Data: 06/01/2026 04:19:53
Endpoint: https://nfews.prefeitura.sp.gov.br/lotenfe.asmx
```

#### Erros Retornados pela Prefeitura:

1. **Erro 1001**:

   ```
   XML não compatível com Schema.
   The value of the 'Versao' attribute does not equal its fixed value.
   ```

   - **Enviado**: `<Cabecalho Versao="2">`
   - **Esperado**: `<Cabecalho Versao="1">`

2. **Erro 1001**:
   ```
   XML não compatível com Schema.
   The element 'RPS' has invalid child element 'InfoComplementares'.
   ```
   - O elemento `<InfoComplementares>` com campos IBS/CBS **não existe** no schema atual

## 📋 Conclusão

O webservice de **PRODUÇÃO** ainda está usando:

- ✅ Schema **v01** (antigo)
- ❌ Schema **v02** (Reforma Tributária) - **NÃO DISPONÍVEL**

## 🔧 Ações Tomadas

### No Backend (NfseSpService.ts):

As funcionalidades da Reforma Tributária foram **DESABILITADAS** temporariamente:

```typescript
// ⚠️ REFORMA TRIBUTÁRIA DESABILITADA - Webservice ainda não atualizado (06/01/2026)
// Descomentar quando o webservice aceitar Versao="2" e <InfoComplementares>

// 0️⃣ Garantir que o Cabecalho tenha Versao="2" (Reforma Tributária)
// console.log("📋 Verificando versão do Cabecalho...");
// if (xml.includes('Versao="1"')) {
//   xml = xml.replace(/(<Cabecalho[^>]*Versao=)"1"/g, '$1"2"');
// }

// 1️⃣ Adicionar InfoComplementares (campos da Reforma Tributária) se necessário
// console.log("🆕 Adicionando campos da Reforma Tributária (IBS/CBS)...");
// xml = this.adicionarInfoComplementaresSeNecessario(xml);
```

**O código está preparado** e **comentado**, pronto para ser ativado quando a Prefeitura atualizar o webservice.

### No Frontend:

**MANTER** `Versao="1"` no Cabecalho:

```typescript
// ✅ CORRETO ATUALMENTE (06/01/2026)
xml += `<Cabecalho Versao="1" xmlns="">`;

// ❌ NÃO USAR ATÉ SEGUNDA ORDEM
// xml += `<Cabecalho Versao="2" xmlns="">`;
```

## 🔍 Como Saber Quando Ativar?

### Sinais de que a Prefeitura atualizou:

1. **Anúncio oficial** no site da Nota Fiscal Paulistana
2. **Email** da Prefeitura para contribuintes
3. **Testes bem-sucedidos** no ambiente de homologação
4. **Erro 1001 desaparece** ao testar com `Versao="2"`

### Teste Simples:

Enviar um XML mínimo com:

```xml
<Cabecalho Versao="2">
  <!-- dados básicos -->
</Cabecalho>
```

Se **NÃO retornar erro 1001**, o webservice foi atualizado.

## 📝 Próximos Passos

### Quando a Prefeitura Ativar a Reforma:

1. **Backend**:

   - Descomentar linhas 390-407 em `NfseSpService.ts`
   - Testar em ambiente de produção

2. **Frontend**:

   - Mudar `Versao="1"` para `Versao="2"` em `Invoice.tsx`

3. **Validação**:
   - Enviar RPS de teste
   - Verificar se NFS-e é gerada corretamente
   - Conferir valores de IBS/CBS no retorno

## 📚 Referências

### Documentação Preparada (aguardando ativação):

- ✅ [docs/SOLUCAO-REFORMA-TRIBUTARIA.md](SOLUCAO-REFORMA-TRIBUTARIA.md) - Solução técnica completa
- ✅ [docs/MUDANCAS-FRONTEND-REFORMA-TRIBUTARIA.md](MUDANCAS-FRONTEND-REFORMA-TRIBUTARIA.md) - Guia para o frontend
- ✅ [docs/xml-exemplo-v02-reforma-tributaria.xml](xml-exemplo-v02-reforma-tributaria.xml) - XML de exemplo
- ✅ **Código implementado e comentado** no backend

### Links Oficiais:

- 🔗 [Página da Reforma Tributária](https://notadomilhao.sf.prefeitura.sp.gov.br/reforma-tributaria/)
- 🔗 [Manual WebService v3.3.4](https://notadomilhao.sf.prefeitura.sp.gov.br/manuais/)
- 🔗 [Schemas XSD v02](https://notadomilhao.sf.prefeitura.sp.gov.br/wp-content/uploads/2025/10/schemas-reformatributaria-v02-2.zip)

## ⏰ Cronograma Esperado

| Data       | Status | Descrição                                            |
| ---------- | ------ | ---------------------------------------------------- |
| 20/12/2023 | ✅     | Emenda Constitucional nº 132 publicada               |
| 16/01/2025 | ✅     | Lei Complementar nº 214 publicada                    |
| 01/01/2026 | ✅     | Reforma Tributária entra em vigor (legislação)       |
| 06/01/2026 | ❌     | **Webservice AINDA NÃO atualizado**                  |
| ???        | ⏳     | Aguardando atualização do webservice pela Prefeitura |

## 🆘 Suporte

Em caso de dúvidas ou quando a Prefeitura anunciar a ativação:

1. Consultar [docs/SOLUCAO-REFORMA-TRIBUTARIA.md](SOLUCAO-REFORMA-TRIBUTARIA.md)
2. Descomentar código no backend
3. Atualizar versão no frontend
4. Testar e validar

---

**Última Atualização**: 06/01/2026 04:30  
**Responsável**: Sistema de emissão NFS-e  
**Status Atual**: ⏳ **Aguardando atualização da Prefeitura**
