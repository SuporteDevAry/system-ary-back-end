export const formatCurrency = (
  value: string,
  currency: "Real" | "Dólar" | string,
  modeSave?: boolean
): string => {
  let numberValue = parseFloat(value);
  if (modeSave) {
    numberValue = parseFloat(value.replace(/[^\d,-]/g, "").replace(",", "."));
  }

  const locale = currency === "Real" ? "pt-BR" : "en-US";

  if (isNaN(numberValue)) {
    return "";
  }

  const typeCurrency = currency === "Dólar" ? "USD" : "BRL";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: typeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export function Extenso(vlr: number): string {
  if (vlr === 0) return "zero";

  const unidades = [
    "",
    "um",
    "dois",
    "três",
    "quatro",
    "cinco",
    "seis",
    "sete",
    "oito",
    "nove",
  ];
  const especiais = [
    "dez",
    "onze",
    "doze",
    "treze",
    "quatorze",
    "quinze",
    "dezesseis",
    "dezessete",
    "dezoito",
    "dezenove",
  ];
  const dezenas = [
    "",
    "",
    "vinte",
    "trinta",
    "quarenta",
    "cinquenta",
    "sessenta",
    "setenta",
    "oitenta",
    "noventa",
  ];
  const centenas = [
    "",
    "cento",
    "duzentos",
    "trezentos",
    "quatrocentos",
    "quinhentos",
    "seiscentos",
    "setecentos",
    "oitocentos",
    "novecentos",
  ];

  let extenso = "";

  const milhoes = Math.floor(vlr / 1000000);
  const milhar = Math.floor((vlr % 1000000) / 1000);
  const centena = Math.floor((vlr % 1000) / 100);
  const dezena = Math.floor((vlr % 100) / 10);
  const unidade = vlr % 10;

  if (milhoes > 0) {
    if (milhoes === 1) {
      extenso += "um milhão";
    } else {
      extenso += Extenso(milhoes) + " milhões";
    }
    if (milhar > 0 || centena > 0 || dezena > 0 || unidade > 0) extenso += ", ";
  }

  if (milhar > 0) {
    if (milhar === 1) {
      extenso += "mil";
    } else {
      extenso += Extenso(milhar) + " mil";
    }
    if (centena > 0 || dezena > 0 || unidade > 0) extenso += " e ";
  }

  if (centena > 0) {
    if (centena === 1 && dezena === 0 && unidade === 0) {
      extenso += "cem";
    } else {
      extenso += centenas[centena];
    }
    if (dezena > 0 || unidade > 0) extenso += " e ";
  }

  if (dezena > 1) {
    extenso += dezenas[dezena];
    if (unidade > 0) extenso += " e " + unidades[unidade];
  } else if (dezena === 1) {
    extenso += especiais[unidade];
  } else if (unidade > 0) {
    extenso += unidades[unidade];
  }

  return extenso.trim();
}

export const insertMaskInCnpj = (cnpj: string) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
};

export const formatDateWithLongMonth = (dateString: string): string => {
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  // Separar dia, mês e ano da data fornecida (formato DD/MM/YYYY)
  const [day, month, year] = dateString.split("/");

  // Obter o nome do mês a partir do índice (mês - 1 porque os meses são baseados em zero)
  const monthName = months[parseInt(month) - 1];

  // Retornar a data no formato desejado
  return `${day} de ${monthName} de ${year}`;
};

export const formatQuantity = (value: string): string => {
  const numericValue = value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona o separador de milhares
};
