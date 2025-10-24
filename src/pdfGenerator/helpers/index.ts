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

export const parseQuantityToNumber = (value: string): number => {
  if (!value) return 0;

  const cleanValue = value.replace(/\./g, "").replace(",", ".");

  return parseFloat(cleanValue) || 0;
};

export const formatQuantityWithDecimal = (value: string): string => {
  if (!value) return "";

  let cleanValue = value.replace(/[^\d,]/g, "");

  const parts = cleanValue.split(",");
  if (parts.length > 2) {
    cleanValue = parts[0] + "," + parts.slice(1).join("");
  }

  if (parts.length === 2) {
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1].slice(0, 3);
    return `${integerPart},${decimalPart}`;
  }

  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const numberToQuantityString = (value: number | string): string => {
  if (!value && value !== 0) return "";

  let numValue: number;

  if (typeof value === "string") {
    if (value.includes(",")) {
      numValue = parseQuantityToNumber(value);
    } else {
      numValue = parseFloat(value);
    }
  } else {
    numValue = value;
  }

  if (isNaN(numValue)) return "";

  const integerPart = Math.floor(numValue);
  const decimalPart = numValue - integerPart;

  if (decimalPart === 0) {
    return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const formattedDecimal = decimalPart.toFixed(3).substring(2);
  const stringValue = `${integerPart},${formattedDecimal}`;

  return formatQuantityWithDecimal(stringValue);
};
