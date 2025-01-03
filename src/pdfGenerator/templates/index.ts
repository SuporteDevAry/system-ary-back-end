import { FC } from "react";

import ContratoTemplateSoja from "./contratoTemplateSoja";

export interface ITemplates {
  template: "contrato" | "contratoTemplateSoja";
}

export const templates: Record<"contrato" | "contratoTemplateSoja", FC<any>> = {
  contrato: ContratoTemplateSoja, // !!!!Remover depois que tiver outro template!!!
  contratoTemplateSoja: ContratoTemplateSoja,
};
