# Ary Oleofar — Backend

API do sistema de gestão da Ary Oleofar (corretora de grãos): contratos de compra e venda, faturamento, emissão de notas fiscais (NFS-e via Focus NFe) e controle de usuários, permissões e produtos.

## Stack

- **Node.js + TypeScript** (CommonJS)
- **Express** — HTTP API, com `express-async-errors` para erros em rotas assíncronas
- **TypeORM + PostgreSQL** — persistência e migrations
- **JWT + bcrypt** — autenticação e hash de senha
- **Nodemailer** — envio de e-mails
- **xml-crypto / xmldom** — integração com o webservice da prefeitura para NFS-e
- **ExcelJS / Puppeteer** — geração de relatórios e PDFs

## Estrutura

```
src/
├── app/
│   ├── controllers/     # regras de cada recurso (Client, GrainContract, Invoices, Nfse, Billings, ...)
│   ├── entities/        # entidades TypeORM
│   ├── helpers/
│   ├── middlewares/     # auth, dev panel, tratamento de erros
│   ├── repositories/
│   ├── routes/          # index.ts com todas as rotas da API
│   └── subscribers/     # AuditSubscriber (log de auditoria via TypeORM)
├── database/
│   ├── data-source.ts   # configuração de conexão + retry de inicialização
│   ├── migrations/
│   └── seeds/
├── pdfGenerator/        # templates e helpers para geração de PDF
├── services/
└── server.ts            # bootstrap da aplicação
```

## Pré-requisitos

- Node.js 20+
- PostgreSQL acessível (local ou remoto)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev             # http://localhost:$SERVER_PORT
```
