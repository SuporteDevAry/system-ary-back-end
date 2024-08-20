import { exec } from 'child_process';

// Função para executar comandos do terminal
const runCommand = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
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
const createMigration = async (migrationName: string) => {
  if (!migrationName) {
    console.error('Nome da migration não fornecido.');
    return;
  }

  const command = `npm run typeorm migration:create src/database/migrations/${migrationName}`;
  console.log(`Executando: ${command}`);

  try {
    await runCommand(command);
    console.log('Migration criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar a migration.');
  }
};

// Pega o nome da migration do argumento da linha de comando
const migrationName = process.argv[2];
createMigration(migrationName);
