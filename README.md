# 🏢 Empresa & Produtos API

Este projeto é uma API RESTful desenvolvida em Node.js usando Express, Prisma e PostgreSQL, para gerenciar **empresas** e **produtos**.

## 📋 Descrição

A aplicação permite:
- Criar, listar, atualizar e deletar **empresas**.
- Criar, listar, atualizar e deletar **produtos**, associando-os a uma empresa específica.
- Consultar todos os produtos de uma determinada empresa.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** — Plataforma de execução JavaScript.
- **Express** — Framework para APIs REST.
- **Prisma ORM** — Modelagem de banco de dados e integração com PostgreSQL.
- **PostgreSQL** — Banco de dados relacional.

---

## 🗂️ Estrutura do Projeto

src/
├── controllers/
│ ├── companyController.ts
│ └── productController.ts
├── services/
│ ├── companyService.ts
│ └── productService.ts
├── repositories/
│ ├── companyRepository.ts
│ └── productRepository.ts
├── prisma/
│ └── schema.prisma
└── index.ts

markdown
Copiar
Editar

---

## 🔗 Endpoints Disponíveis

### 📦 Empresas
- **POST** `/companies` — Cria uma nova empresa.
- **GET** `/companies` — Lista todas as empresas.
- **GET** `/companies/:id` — Consulta uma empresa pelo ID.
- **PATCH** `/companies/:id` — Atualiza uma empresa.
- **DELETE** `/companies/:id` — Remove uma empresa.

### 🛒 Produtos
- **POST** `/products` — Cria um novo produto.
- **GET** `/products` — Lista todos os produtos.
- **GET** `/products/:id` — Consulta um produto pelo ID.
- **PATCH** `/products/:id` — Atualiza um produto.
- **DELETE** `/products/:id` — Remove um produto.
- **GET** `/companies/products/:companyId` — Lista todos os produtos de uma empresa.

---

## ⚙️ Execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   cd nome-do-repositorio

Rode o comando para executar através do docker compose:

    docker-compose up --build


A API estará disponível em http://localhost:5000.


🤝 Autor
Desenvolvido por Rafael Oliveira Rosário.
