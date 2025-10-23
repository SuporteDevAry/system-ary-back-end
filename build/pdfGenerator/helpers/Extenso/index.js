"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extenso = void 0;
function Extenso(vlr, genero) {
    if (genero === void 0) { genero = "M"; }
    // suporta número ou string (com pontos e vírgulas)
    var numStr = String(vlr).trim();
    // remover separador de milhares e normalizar decimal para ponto
    numStr = numStr.replace(/\./g, "").replace(/,/g, ".");
    var num = Math.floor(Number(numStr) || 0);
    if (num === 0)
        return "zero";
    var unidadesM = [
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
    var unidadesF = [
        "",
        "uma",
        "duas",
        "três",
        "quatro",
        "cinco",
        "seis",
        "sete",
        "oito",
        "nove",
    ];
    var especiais = [
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
    var dezenas = [
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
    var centenasM = [
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
    var centenasF = [
        "",
        "cento",
        "duzentas",
        "trezentas",
        "quatrocentas",
        "quinhentas",
        "seiscentas",
        "setecentas",
        "oitocentas",
        "novecentas",
    ];
    var unidades = genero === "F" ? unidadesF : unidadesM;
    var centenas = genero === "F" ? centenasF : centenasM;
    function extensoAte999(n) {
        if (n === 0)
            return "";
        if (n === 100)
            return "cem";
        var c = Math.floor(n / 100);
        var d = Math.floor((n % 100) / 10);
        var u = n % 10;
        var str = "";
        if (c > 0)
            str += centenas[c];
        if (d > 0 || u > 0) {
            if (str !== "")
                str += " e ";
            if (d === 1) {
                str += especiais[u];
            }
            else {
                if (d > 0) {
                    str += dezenas[d];
                    if (u > 0)
                        str += " e ";
                }
                if (u > 0)
                    str += unidades[u];
            }
        }
        return str;
    }
    var extenso = "";
    var milhoes = Math.floor(num / 1000000);
    var milhar = Math.floor((num % 1000000) / 1000);
    var resto = num % 1000;
    if (milhoes > 0) {
        if (milhoes === 1) {
            extenso += "um milhão";
        }
        else {
            extenso += Extenso(milhoes, genero) + " milhões";
        }
        if (milhar > 0 || resto > 0)
            extenso += ", ";
    }
    if (milhar > 0) {
        if (milhar === 1) {
            extenso += "mil";
        }
        else {
            extenso += Extenso(milhar, genero) + " mil";
        }
        if (resto > 0)
            extenso += " e ";
    }
    if (resto > 0) {
        extenso += extensoAte999(resto);
    }
    return extenso.trim();
}
exports.Extenso = Extenso;
//# sourceMappingURL=index.js.map