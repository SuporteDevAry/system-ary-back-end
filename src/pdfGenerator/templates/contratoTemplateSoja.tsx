import React from "react";
import {
  formatCurrency,
  Extenso,
  insertMaskInCnpj,
  formatDateWithLongMonth,
  formatQuantity,
} from "../helpers";
import path from "path";
import fs from "fs";

const logoContrato = path.resolve(
  __dirname,
  "../helpers/Logo_Ary_Completo.jpg"
);
const logoBase64 = `data:image/jpeg;base64,${fs
  .readFileSync(logoContrato)
  .toString("base64")}`;

interface ContratoTemplateProps {
  data: any;
  typeContract: "Vendedor" | "Comprador";
  modeSave: boolean;
}

const ContratoTemplateSoja: React.FC<ContratoTemplateProps> = ({
  data,
  typeContract,
  modeSave,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear().toString().substr(-2);

  // Verifique se data é válida e contém as propriedades necessárias
  if (!data || Object.keys(data).length === 0) {
    return <div>Erro: Dados do contrato não encontrados.</div>;
  }

  // Extraindo as propriedades necessárias de data
  const {
    seller,
    buyer,
    number_contract,
    product,
    number_broker,
    quantity,
    commission_seller,
    commission_buyer,
    quality,
    price,
    type_currency,
    complement_destination,
    destination,
    icms,
    payment,
    pickup,
    pickup_location,
    inspection,
    observation,
    crop,
    name_product,
    type_commission_seller,
    type_commission_buyer,
    type_pickup,
  } = data;

  // Lógica de formatação
  let quantity_aux = modeSave
    ? !quantity.match(/,/g)
      ? quantity.replace(/[.]/g, "")
      : quantity.replace(/[,]/g, ".")
    : quantity;

  let formattedQtd = formatQuantity(quantity_aux);
  const qtde_extenso = Extenso(quantity_aux);
  let formattedExtenso = `(${qtde_extenso})`;

  let formattedSellerCNPJ = seller?.cnpj_cpf
    ? insertMaskInCnpj(seller.cnpj_cpf)
    : "";
  let formattedBuyerCNPJ = buyer?.cnpj_cpf
    ? insertMaskInCnpj(buyer.cnpj_cpf)
    : "";

  let formattedCSeller = commission_seller
    ? type_commission_seller === "Percentual"
      ? `${commission_seller}%`
      : `${formatCurrency(commission_seller, type_currency, true)} por saca,`
    : "";

  let formattedCBuyer = commission_buyer
    ? type_commission_buyer === "Percentual"
      ? `${commission_buyer}%`
      : `${formatCurrency(commission_buyer, type_currency, true)} por saca,`
    : "";

  const numberContract = number_contract
    ? number_contract
    : `${product}.${number_broker}-NNN/${currentYear}`;

  function formatObservationText(observation: string) {
    const lines = observation.split("\n");
    return lines
      .map((line) => {
        if (/^\d+-/.test(line)) {
          return `<span style="display:block; margin-left:0;">${line}</span>`;
        } else {
          return `<span style="display:block; margin-left:15px;">${line}</span>`;
        }
      })
      .join("");
  }

  const listProductsForMetricTon = ["O", "F", "OC", "OA", "SB", "EP"];
  const validProductsForMetricTon = listProductsForMetricTon.includes(
    data.product
  );

  let formattedSafra = validProductsForMetricTon
    ? ` `
    : ` - Safra: ${data.crop}`;

  let formattedMetrica =
    data.type_quantity === "toneladas métricas"
      ? ` toneladas métricas.`
      : ` quilos.`;

  let Dot =
    data.destination === "Nenhum" && data.complement_destination?.length === 0
      ? "."
      : ", ";

  let formattedPreco =
    data.type_quantity === "toneladas métricas"
      ? ` por tonelada métrica${Dot}`
      : ` por saca de 60(sessenta) quilos${Dot}`;

  let formattedComplementSeller = data.seller?.complement
    ? `${" - "} ${data.seller.complement} `
    : "";

  let formattedComplementBuyer = data.buyer?.complement
    ? `${" - "} ${data.buyer.complement} `
    : "";

  return (
    <div id="contrato">
      <div style={{ margin: 0, textAlign: "center" }}>
        <img src={logoBase64} alt="logo Ary Completo" width={300} />
      </div>
      <br />
      <h3>
        <div style={{ paddingLeft: "250px" }}>
          São Paulo,{" "}
          <span>{formatDateWithLongMonth(data.contract_emission_date)}</span>
        </div>
        <div style={{ paddingLeft: "250px" }}>
          Confirmação de negociação <span> {numberContract} </span>
        </div>
      </h3>
      <br />

      {/* VENDEDOR */}
      <div style={{ display: "table", width: "100%", marginBottom: "20px" }}>
        <div style={{ display: "table-row" }}>
          <div
            style={{
              display: "table-cell",
              fontWeight: "bold",
              width: "110px",
              verticalAlign: "top",
            }}
          >
            VENDEDOR:
          </div>
          <div style={{ display: "table-cell" }}>
            <div>{seller.name}</div>
            <div>
              {seller.address}, {seller.number} {formattedComplementSeller} -{" "}
              {seller.district}
            </div>
            <div>
              <strong>
                {seller.city} - {seller.state}
              </strong>
            </div>
            <div>
              CNPJ: {formattedSellerCNPJ} &nbsp;&nbsp; Inscr.Est.:{" "}
              {seller.ins_est}
            </div>
          </div>
        </div>
      </div>

      {/* COMPRADOR */}
      <div style={{ display: "table", width: "100%", marginBottom: "20px" }}>
        <div style={{ display: "table-row" }}>
          <div
            style={{
              display: "table-cell",
              fontWeight: "bold",
              width: "110px",
              verticalAlign: "top",
            }}
          >
            COMPRADOR:
          </div>
          <div style={{ display: "table-cell" }}>
            <div>{buyer.name}</div>
            <div>
              {buyer.address}, {buyer.number} {formattedComplementBuyer} -{" "}
              {buyer.district}
            </div>
            <div>
              <strong>
                {buyer.city} - {buyer.state}
              </strong>
            </div>
            <div>
              CNPJ: {formattedBuyerCNPJ} &nbsp;&nbsp; Inscr.Est.:{" "}
              {buyer.ins_est}
            </div>
          </div>
        </div>
      </div>

      <br />
      <div style={{ textAlign: "left", margin: "0" }}>
        <strong>Mercadoria:</strong>
        <div style={{ textAlign: "left" }}>
          <span>{name_product}</span>
          <span>
            <strong>
              <span>{formattedSafra}</span>
            </strong>
          </span>
        </div>
      </div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>Qualidade:</strong>
      </div>
      <div style={{ textAlign: "left", whiteSpace: "pre-line" }}>{quality}</div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>Quantidade:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>
        <strong>
          {formattedQtd} {formattedExtenso}
        </strong>{" "}
        {formattedMetrica}
      </div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>Preço:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>
        <strong>
          {data.type_currency === "Dólar"
            ? `${formatCurrency(price, data.type_currency, modeSave).replace(
                "$",
                "US$ "
              )}`
            : formatCurrency(price, data.type_currency, modeSave)}
        </strong>{" "}
        {formattedPreco}
        {/* {destination && (
          <span>
            <strong>
              (
              {complement_destination
                ? `${destination} ${complement_destination}`
                : destination}
              )
            </strong>
            .
          </span>
        )} */}
        {(destination !== "Nenhum" || complement_destination) && (
          <span>
            <strong>
              (
              {destination === "Nenhum"
                ? complement_destination || ""
                : `${destination}${
                    complement_destination ? ` ${complement_destination}` : ""
                  }`}
              )
            </strong>
            .
          </span>
        )}
      </div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>ICMS:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>{icms}</div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>Pagamento:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>{payment}</div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>{type_pickup}:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>{pickup}</div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>Local de {type_pickup}:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>{pickup_location}</div>
      <br />

      <div style={{ textAlign: "left" }}>
        <strong>Conferência:</strong>
      </div>
      <div style={{ textAlign: "justify" }}>{inspection}</div>
      <br />

      {observation && (
        <div style={{ textAlign: "left" }}>
          <strong>Observações:</strong>
        </div>
      )}
      <div
        style={{ textAlign: "justify", whiteSpace: "pre" }}
        dangerouslySetInnerHTML={{
          __html: formatObservationText(observation),
        }}
      />
      <br />

      <div style={{ textAlign: "justify" }}>
        <strong>
          "Favor comunicar qualquer discrepância em 01 (um) dia útil do
          recebimento da confirmação por escrito. Se não houver discrepâncias
          relatadas, presume-se que todas as partes envolvidas aceitam e
          concordam com todos os termos conforme descrito na confirmação de
          negócio acima."
        </strong>
      </div>
      <br />

      {typeContract === "Vendedor" && formattedCSeller ? (
        <div style={{ textAlign: "justify" }}>
          <strong>===</strong>
          <br />
          <strong>
            Comissão de <span>{formattedCSeller.replace(".", ",")}</span>
            {"  "}
            por conta do vendedor.
          </strong>
          <br />
          <strong>===</strong>
        </div>
      ) : (
        ""
      )}

      {typeContract === "Comprador" && formattedCBuyer ? (
        <div style={{ textAlign: "justify" }}>
          <strong>===</strong>
          <br />
          <strong>
            Comissão de <span>{formattedCBuyer.replace(".", ",")}</span>
            {"  "}
            por conta do comprador.
          </strong>
          <br />
          <strong>===</strong>
        </div>
      ) : (
        ""
      )}

      <br />
      <br />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
          }}
        >
          <div style={{ flex: "1" }}>
            ______________________________________
          </div>
          <div style={{ flex: "1" }}>_____________________________________</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
          }}
        >
          <div style={{ flex: "1" }}>
            <strong>VENDEDOR</strong>
          </div>
          <div style={{ flex: "1" }}>
            <strong>COMPRADOR</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoTemplateSoja;
