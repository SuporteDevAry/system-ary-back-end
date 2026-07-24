"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
// Função para executar comandos do terminal
const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return reject(new Error(stderr));
            }
            console.log(stdout);
            resolve();
        });
    });
};
// Função principal para criar uma migration
const createMigration = async (migrationName) => {
    if (!migrationName) {
        console.error('Nome da migration não fornecido.');
        return;
    }
    const command = `npm run typeorm migration:create src/database/migrations/${migrationName}`;
    console.log(`Executando: ${command}`);
    try {
        await runCommand(command);
        console.log('Migration criada com sucesso!');
    }
    catch (error) {
        console.error('Erro ao criar a migration.');
    }
};
// Pega o nome da migration do argumento da linha de comando
const migrationName = process.argv[2];
createMigration(migrationName);
//# sourceMappingURL=createMigration.js.map