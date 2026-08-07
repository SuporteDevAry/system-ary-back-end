import React from "react";
import path from "path";
import fs from "fs";
import {
  formatCurrency,
  formatDateWithLongMonth,
  numberToQuantityString,
} from "../helpers";
import { Extenso } from "../helpers/Extenso";

const logoContrato = path.resolve(
  __dirname,
  "../helpers/Logo_Ary_Completo.jpg"
);
const logoBase64 = `data:image/jpeg;base64,${fs
  .readFileSync(logoContrato)
  .toString("base64")}`;

interface ContratoAditivoTemplateProps {
  data: any;
  typeContract: "Vendedor" | "Comprador";
}

// "Aditivo Contratual — Fixação de CBOT, Prêmio e Câmbio": versão server-side
// (Puppeteer) do mesmo documento gerado no front-end (src/templates/fixacaoParcial.tsx),
// usada exclusivamente pelo envio de e-mail da fixação.
const ContratoAditivoTemplate: React.FC<ContratoAditivoTemplateProps> = ({
  data,
}) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>Erro: Dados da fixação não encontrados.</div>;
  }

  const {
    seller,
    buyer,
    number_contract,
    parent_number_contract,
    contract_emission_date,
    name_product,
    crop,
    type_quantity,
    number_external_contract_buyer,
    number_external_contract_seller,
    quantity,
    fixation_date,
    reference_month,
    cbot_code,
    cbot_value,
    premium,
    conversion_factor,
    fobbings,
    ppe_usd,
    price_usd_per_saca,
    price,
    exchange_rate,
    exchange_rate_date,
  } = data;

  const today = new Date().toLocaleDateString("pt-BR");
  const isMetricTon = type_quantity === "toneladas métricas";
  const unidade = isMetricTon ? "toneladas" : "quilos";

  const quantityValue = Number(quantity) || 0;
  const formattedQtd = numberToQuantityString(quantityValue);
  const formattedExtenso = `(${Extenso(
    Math.round(quantityValue),
    isMetricTon ? "F" : "M"
  )})`;

  const externalContractRef =
    number_external_contract_buyer || number_external_contract_seller;

  const sectionStyle: React.CSSProperties = { margin: "0 0 14px 0" };
  const labelCellStyle: React.CSSProperties = {
    width: "190px",
    padding: "3px 0",
    verticalAlign: "top",
  };
  const valueCellStyle: React.CSSProperties = { padding: "3px 0" };

  return (
    <div
      id="contrato"
      style={{
        fontFamily: "Roboto, Arial, sans-serif",
        fontSize: "14px",
        lineHeight: 1.5,
        color: "#000",
        padding: "24px",
      }}
    >
      <div style={{ margin: "0 0 16px 0", textAlign: "center" }}>
        <img src={logoBase64} alt="logo ary completo jpg" width={280} />
      </div>

      <p style={{ ...sectionStyle, textAlign: "center" }}>
        São Paulo, {formatDateWithLongMonth(today)}
      </p>

      <h3 style={{ ...sectionStyle, textAlign: "center" }}>
        ADITIVO CONTRATUAL
      </h3>

      <p style={{ ...sectionStyle, textAlign: "center" }}>
        Referente a Confirmação de venda nr. {parent_number_contract}
        <br />
        {contract_emission_date
          ? `fechada em ${formatDateWithLongMonth(contract_emission_date)}`
          : ""}
      </p>

      <p style={sectionStyle}>
        <strong>VENDEDOR :</strong> {seller?.name}
      </p>

      <p style={sectionStyle}>
        <strong>COMPRADOR :</strong> {buyer?.name}
      </p>

      <p style={sectionStyle}>
        <strong>Mercadoria :</strong> {name_product}
        {crop ? ` - Safra: ${crop}` : ""}
      </p>

      <p style={{ ...sectionStyle, textAlign: "center" }}>
        <strong>FIXAÇÃO DE CBOT, PRÊMIO E CÂMBIO</strong>
      </p>

      <p style={{ margin: "0 0 4px 0" }}>
        <strong>{name_product}</strong>
        {crop ? ` ${crop}` : ""}
      </p>
      <p style={{ margin: "0 0 4px 0" }}>
        Contratos = ARY: {parent_number_contract}
        {externalContractRef ? ` // ${externalContractRef}` : ""}
      </p>
      <p style={{ margin: "0 0 4px 0" }}>
        Quantidade: {formattedQtd} {formattedExtenso} {unidade}
      </p>
      <p style={{ margin: "0 0 4px 0" }}>
        CBOT: {cbot_code} = {Number(cbot_value ?? 0).toFixed(2)}
      </p>
      <p style={sectionStyle}>
        Câmbio Pagamento {exchange_rate_date} = {exchange_rate}
      </p>

      <p style={{ margin: "0 0 4px 0" }}>
        <strong>Memória de Cálculo:</strong>
      </p>
      <p style={{ margin: "0 0 4px 0" }}>
        <strong>{reference_month}</strong>
      </p>
      <table style={{ borderCollapse: "collapse", marginBottom: "14px" }}>
        <tbody>
          <tr>
            <td style={labelCellStyle}>CBOT</td>
            <td style={valueCellStyle}>{Number(cbot_value ?? 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>Prêmio</td>
            <td style={valueCellStyle}>{Number(premium ?? 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>Fator Conv (t/m)</td>
            <td style={valueCellStyle}>{conversion_factor}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>Fobbings/tm</td>
            <td style={valueCellStyle}>{Number(fobbings ?? 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>PPE (Preço Parid. Exp.)</td>
            <td style={valueCellStyle}>USD {Number(ppe_usd ?? 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ ...labelCellStyle, paddingLeft: "24px" }}>SACA</td>
            <td style={valueCellStyle}>
              USD {Number(price_usd_per_saca ?? 0).toFixed(2)} x {exchange_rate}{" "}
              = {formatCurrency(String(price ?? 0), "Real")} p/ saca
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ ...sectionStyle, textAlign: "justify" }}>
        "Favor comunicar qualquer discrepância em 01 (um) dia útil do
        recebimento da confirmação por escrito. Se não houver discrepâncias
        relatadas, presume-se que todas as partes envolvidas aceitam e
        concordam com todos os termos conforme descrito na confirmação de
        negócio acima."
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "50px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div>______________________________</div>
          <strong>VENDEDOR</strong>
        </div>
        <div style={{ textAlign: "center" }}>
          <div>_____________________________</div>
          <strong>COMPRADOR</strong>
        </div>
      </div>

      <p style={{ marginTop: "24px", fontSize: "10px", color: "#666" }}>
        Fixação nr. {number_contract}
      </p>
    </div>
  );
};

export default ContratoAditivoTemplate;
