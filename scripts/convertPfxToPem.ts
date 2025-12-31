/**
 * Script para converter certificado PFX para PEM
 * Execute apenas UMA VEZ após configurar o PFX_PATH e PFX_PASSPHRASE no .env
 *
 * Uso: npx ts-node scripts/convertPfxToPem.ts
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const pfxPath = process.env.PFX_PATH;
const pfxPassphrase = process.env.PFX_PASSPHRASE;
const certDir = path.join(__dirname, "..", "certificates");

if (!pfxPath || !pfxPassphrase) {
  console.error("❌ Configure PFX_PATH e PFX_PASSPHRASE no arquivo .env");
  process.exit(1);
}

// Criar diretório de certificados se não existir
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
  console.log("✅ Diretório certificates/ criado");
}

const certPemPath = path.join(certDir, "cert.pem");
const keyPemPath = path.join(certDir, "key.pem");

try {
  console.log("🔄 Convertendo certificado PFX para PEM...");

  // Extrair certificado
  execSync(
    `openssl pkcs12 -in "${pfxPath}" -clcerts -nokeys -out "${certPemPath}" -passin pass:"${pfxPassphrase}" -legacy`,
    { stdio: "inherit" }
  );
  console.log(`✅ Certificado extraído: ${certPemPath}`);

  // Extrair chave privada
  execSync(
    `openssl pkcs12 -in "${pfxPath}" -nocerts -nodes -out "${keyPemPath}" -passin pass:"${pfxPassphrase}" -legacy`,
    { stdio: "inherit" }
  );
  console.log(`✅ Chave privada extraída: ${keyPemPath}`);

  console.log("\n✅ Conversão concluída com sucesso!");
  console.log(
    '⚠️  IMPORTANTE: Adicione "certificates/" no .gitignore para não commitar as chaves!'
  );
} catch (error) {
  console.error("❌ Erro ao converter certificado:", error);
  process.exit(1);
}
