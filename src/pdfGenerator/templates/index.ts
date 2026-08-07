import { FC } from "react";

import ContratoTemplateSoja from "./contratoTemplateSoja";
import ContratoAditivoTemplate from "./contratoAditivoTemplate";

export interface ITemplates {
  template: "contrato" | "contratoTemplateSoja" | "contratoAditivoTemplate";
}

export const templates: Record<
  "contrato" | "contratoTemplateSoja" | "contratoAditivoTemplate",
  FC<any>
> = {
  contrato: ContratoTemplateSoja, // !!!!Remover depois que tiver outro template!!!
  contratoTemplateSoja: ContratoTemplateSoja,
  contratoAditivoTemplate: ContratoAditivoTemplate,
};
