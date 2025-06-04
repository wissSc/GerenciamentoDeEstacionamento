# README - Sistema de Controle de Acesso ao Estacionamento SENAI

Este projeto implementa um sistema digital de controle de acesso ao estacionamento para o SENAI São José, com backend em Node.js/Express e frontend em React.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **backend**: API RESTful em Node.js com Express, autenticação JWT e banco de dados PostgreSQL
- **frontend**: Interface de usuário em React com estilização minimalista

## Requisitos

- Node.js (versão 16.x ou superior)
- PostgreSQL (versão 13.x ou superior)
- NPM ou Yarn

## Configuração e Execução

### Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais de banco de dados:
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senai_estacionamento
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
```

4. Crie o banco de dados PostgreSQL:
```sql
CREATE DATABASE senai_estacionamento;
```

5. Execute o script SQL para criar as tabelas (disponível no arquivo modelo_dados_postgresql.sql)

6. Inicie o servidor:
```bash
npm run dev
```

O backend estará disponível em `http://localhost:3001`.

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`.

## Funcionalidades Implementadas

### Backend

- Autenticação com JWT e CORS
- Gestão de usuários (alunos, professores e funcionários)
- Gestão de veículos
- Controle de acesso (entrada/saída)
- Monitoramento de vagas disponíveis

### Frontend

- Login e cadastro de usuários
- Dashboard com status do estacionamento
- Gestão de veículos (cadastro, edição, exclusão)
- Registro de entrada e saída de veículos

## Usuário Administrador Padrão

Para acessar o sistema pela primeira vez, utilize:

- Email: admin@senai.edu.br
- Senha: admin123

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, JWT, Sequelize, PostgreSQL
- **Frontend**: React, React Router, Axios

## Observações

Este é um protótipo funcional que atende aos requisitos básicos do sistema. Para um ambiente de produção, recomenda-se implementar testes automatizados, melhorar a segurança e otimizar o desempenho.
