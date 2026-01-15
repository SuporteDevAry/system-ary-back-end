import fs from "fs";
import path from "path";
import { FocusNfeService } from "../src/services/FocusNfeService";

async function main() {
  const xmlPath = "/home/ahcamargo/Downloads/lote_rps_20260107_115552.xml";
  if (!fs.existsSync(xmlPath)) {
    console.error("XML file not found at:", xmlPath);
    process.exit(1);
  }
  const xml = fs.readFileSync(xmlPath, "utf-8");

  const service = new FocusNfeService();
  const converter: any = service as any;
  try {
    const payload = await converter.converterXmlParaFocusNfe(xml);
    console.log("\nConverted FocusNfe payload:\n");
    console.log(JSON.stringify(payload, null, 2));
    if (payload?.servico?.item_lista_servico) {
      console.log("\nitem_lista_servico:", payload.servico.item_lista_servico);
    }
  } catch (err: any) {
    console.error("Conversion failed:", err?.message || err);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
