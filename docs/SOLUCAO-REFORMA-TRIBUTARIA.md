# Solução: Erros 1204 e 1206 - Reforma Tributária 2026

## 🎯 Problema Identificado

A Prefeitura de São Paulo implementou a **Reforma Tributária** em **01/01/2026**, tornando obrigatório o uso do **novo layout v02** da NFS-e com campos adicionais para **IBS** (Imposto sobre Bens e Serviços) e **CBS** (Contribuição sobre Bens e Serviços).

### Erros Encontrados:

- **Erro 1204**: "Valor Total de Serviços não confere com o enviado (0)"
- **Erro 1206**: "Assinatura Digital do RPS incorreta"

### Causa Raiz:

O XML está sendo enviado com schema v02 mas **sem os campos obrigatórios da Reforma Tributária**, causando interpretação incorreta dos valores e invalidação da assinatura.

## 📋 Campos Obrigatórios Adicionados (v02)

### 1. Estrutura `<InfoComplementares>` dentro de cada `<RPS>`:

```xml
<InfoComplementares>
  <!-- Classificação Tributária -->
  <cClassTrib>01</cClassTrib>
  <dhEmissao>2026-01-06T10:00:00</dhEmissao>
  <tpEmissao>1</tpEmissao>
  <verProc>1.0.0</verProc>

  <!-- Informações do Serviço com IBS/CBS -->
  <infServ>
    <CST>00</CST>
    <cNBS>1.0101.00.00</cNBS>
    <vServPrest>10.00</vServPrest>
    <vBC>10.00</vBC>
    <pAliq>5.00</pAliq>
    <vTributo>0.50</vTributo>

    <!-- IBS -->
    <vBCIBS>10.00</vBCIBS>
    <pAliqIBS>2.50</pAliqIBS>
    <vIBS>0.25</vIBS>

    <!-- CBS -->
    <vBCCBS>10.00</vBCCBS>
    <pAliqCBS>2.50</pAliqCBS>
    <vCBS>0.25</vCBS>
  </infServ>

  <!-- Local da Prestação -->
  <infLocalPrest>
    <cMunIncid>3550308</cMunIncid>
    <UF>SP</UF>
  </infLocalPrest>
</InfoComplementares>
```

## 🔧 Modificações Necessárias no Código

### Arquivo: `src/services/NfseSpService.ts`

#### 1. Atualizar Interface do RPS para incluir novos campos:

```typescript
interface RPSData {
  // Campos existentes...
  inscricaoPrestador: string;
  serieRPS: string;
  numeroRPS: string;
  dataEmissao: string;
  valorServicos: string;
  // ... outros campos

  // NOVOS CAMPOS REFORMA TRIBUTÁRIA
  cClassTrib: string; // Código de Classificação Tributária (ex: "01")
  cNBS: string; // Código NBS (ex: "1.0101.00.00")
  CST: string; // Código de Situação Tributária (ex: "00")
  vBCIBS: string; // Base de cálculo IBS
  pAliqIBS: string; // Alíquota IBS (ex: "2.50")
  vIBS: string; // Valor IBS
  vBCCBS: string; // Base de cálculo CBS
  pAliqCBS: string; // Alíquota CBS (ex: "2.50")
  vCBS: string; // Valor CBS
  cMunIncid: string; // Código município de incidência (ex: "3550308" = São Paulo)
  verProc: string; // Versão do processo emissor
}
```

#### 2. Criar função para montar InfoComplementares:

```typescript
private montarInfoComplementares(data: RPSData): string {
  const dhEmissao = new Date().toISOString().split('.')[0]; // Formato: 2026-01-06T10:00:00

  return `
    <InfoComplementares>
      <cClassTrib>${data.cClassTrib || '01'}</cClassTrib>
      <cEnqTribCoop></cEnqTribCoop>
      <dhEmissao>${dhEmissao}</dhEmissao>
      <tpEmissao>1</tpEmissao>
      <verProc>${data.verProc || '1.0.0'}</verProc>

      <infServ>
        <CST>${data.CST || '00'}</CST>
        <cNBS>${data.cNBS || '1.0101.00.00'}</cNBS>
        <vServPrest>${data.valorServicos}</vServPrest>
        <vBC>${data.valorServicos}</vBC>
        <pAliq>5.00</pAliq>
        <vTributo>${(parseFloat(data.valorServicos) * 0.05).toFixed(2)}</vTributo>

        <vBCIBS>${data.vBCIBS || data.valorServicos}</vBCIBS>
        <pAliqIBS>${data.pAliqIBS || '2.50'}</pAliqIBS>
        <vIBS>${data.vIBS || (parseFloat(data.valorServicos) * 0.025).toFixed(2)}</vIBS>

        <vBCCBS>${data.vBCCBS || data.valorServicos}</vBCCBS>
        <pAliqCBS>${data.pAliqCBS || '2.50'}</pAliqCBS>
        <vCBS>${data.vCBS || (parseFloat(data.valorServicos) * 0.025).toFixed(2)}</vCBS>
      </infServ>

      <infLocalPrest>
        <cMunIncid>${data.cMunIncid || '3550308'}</cMunIncid>
        <UF>SP</UF>
      </infLocalPrest>
    </InfoComplementares>
  `;
}
```

#### 3. Atualizar função de construção do XML:

No método que monta o XML do RPS, adicionar a chamada para `montarInfoComplementares()` **após** o campo `<Discriminacao>` e **antes** de fechar `</RPS>`.

## 📚 Referências Oficiais

### Documentação:

- **Manual WebService v3.3.4**: https://notadomilhao.sf.prefeitura.sp.gov.br/manuais/
- **Schemas XSD v02**: https://notadomilhao.sf.prefeitura.sp.gov.br/wp-content/uploads/2025/10/schemas-reformatributaria-v02-2.zip
- **Página Reforma Tributária**: https://notadomilhao.sf.prefeitura.sp.gov.br/reforma-tributaria/

### Tabelas de Códigos:

- **CST (Código de Situação Tributária)**: Consultar Portal NF-e Federal
- **cClassTrib (Classificação Tributária)**: Valores de 01 a 99
- **cNBS (Nomenclatura Brasileira de Serviços)**: Formato X.XXXX.XX.XX

### Valores Padrão para Testes:

```
cClassTrib: "01"
CST: "00" (Tributação normal)
cNBS: "1.0101.00.00" (consultar tabela NBS conforme seu serviço)
pAliqIBS: "2.50" (2,5%)
pAliqCBS: "2.50" (2,5%)
cMunIncid: "3550308" (São Paulo/SP)
tpEmissao: "1" (Normal)
verProc: "1.0.0"
```

## ⚠️ Observações Importantes

1. **Assinatura RPS**: Verificar se a assinatura SHA-1 precisa incluir os novos campos ou se mantém o formato antigo
2. **Formato de Valores**: Manter formato decimal (10.00), não usar centavos no XML
3. **Namespace**: Garantir namespace correto `xmlns="http://www.prefeitura.sp.gov.br/nfe"`
4. **Data/Hora**: Usar formato ISO 8601 para `dhEmissao`: `YYYY-MM-DDTHH:MM:SS`
5. **Ambiente de Testes**: Prefeitura disponibilizou ambiente de teste para validação

## 🚀 Próximos Passos

1. ✅ Adicionar novos campos à interface TypeScript
2. ✅ Implementar função `montarInfoComplementares()`
3. ⚠️ Verificar se assinatura RPS precisa ser recalculada com novos campos
4. ⚠️ Atualizar construção do XML para incluir `<InfoComplementares>`
5. ⚠️ Testar no ambiente de produção
6. ⚠️ Validar resposta da Prefeitura

## 📝 Notas de Versão

- **v02**: Layout com campos IBS/CBS (obrigatório desde 01/01/2026)
- **v01**: Layout antigo (descontinuado)
- **Versão Cabecalho**: Deve ser "2" no atributo `Versao`
