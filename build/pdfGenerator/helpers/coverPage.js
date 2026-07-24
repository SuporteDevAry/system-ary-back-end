"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folhaDeRostoBuffer = void 0;
const folhaDeRostoText = `

Segue anexo uma (01) cópia de nossa confirmação.

Solicitamos carimbar e assinar a mesma e nos devolver por e-mail o mais breve possível.

Agradecemos e nos colocamos à disposição.

Saudações,

[Assinatura]

Este contrato foi criado e enviado via sistema, pedimos a gentileza que confirme o recebimento.
`.trim();
exports.folhaDeRostoBuffer = Buffer.from(folhaDeRostoText, "utf-8");
//# sourceMappingURL=coverPage.js.map