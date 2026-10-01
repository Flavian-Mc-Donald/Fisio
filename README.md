🏥 FisioV1 - API REST com TypeScript e MongoDB (Mongoose)
A FisioV1 é uma API REST desenvolvida em TypeScript, Express e MongoDB (via Mongoose ODM), projetada para a gestão completa de uma clínica de pilates e fisioterapia.

O projeto adota uma arquitetura em camadas limpa, modular e desacoplada, aplicando os princípios de Inversão de Controle (IoC), Injeção de Dependências e Isolamento de Infraestrutura, cobrindo os critérios de avaliação da disciplina.

🛠️ Stack Tecnológica
Runtime: Node.js (v24+)
Linguagem: TypeScript v6.0.3 (target: es2025 e strict: true)
Framework Web: Express v5.2.1
Banco de Dados NoSQL: MongoDB v7+ (Rodando em contêiner Docker na porta 27017)
ODM: Mongoose v8+
Testes: Jest v30.4.2 com preset ts-jest
Ferramentas: ts-node-dev para recarregamento automático
🏗️ Arquitetura e Inversão de Controle (IoC)
A arquitetura do projeto foi desenhada para isolar a lógica de negócios da infraestrutura de banco de dados:

Apresentação (Controllers e Routes): Isola a interação HTTP, validação de payload via DTOs e códigos de status da resposta.
Negócio (Services e Domain Models): Contém as regras de agendamento, permissões por perfil (Role) e validações clínicas, dependendo apenas das abstrações/contratos dos Repositórios.
Acesso a Dados (Repositories Abstratos): Define o contrato de operações de CRUD (save, findById, findAll, update, delete).
Infraestrutura (Mongoose Repositories, Schemas e Config): Implementa os repositórios concretos do MongoDB usando Mongoose ODM, mapeando documentos BSON para instâncias do domínio.
Essa separação permitiu substituir o repositório em memória pelo repositório NoSQL MongoDB sem alterar a regra de negócio nos Services ou Controllers.

📁 Estrutura do Projeto
FisioV1/
├── src/
│   ├── config/
│   │   └── database.ts             # Conexão isolada com MongoDB (Mongoose)
│   ├── types/
│   │   ├── roles.enum.ts           # Enum de perfis (ADMIN, RECEPTIONIST, INSTRUCTOR, CLIENT)
│   │   └── express.d.ts            # Extensão de tipagem do Express Request
│   ├── models/
│   │   ├── client.model.ts         # Entidade de Domínio: Cliente
│   │   ├── instructor.model.ts     # Entidade de Domínio: Instrutor
│   │   ├── appointment.model.ts    # Entidade de Domínio: Agendamento
│   │   └── schemas/                # Schemas e Models Mongoose
│   │       ├── client.schema.ts
│   │       ├── instructor.schema.ts
│   │       └── appointment.schema.ts
│   ├── dtos/                       # Data Transfer Objects
│   ├── repositories/
│   │   ├── client.repository.ts    # Classe abstrata (Contrato Clientes)
│   │   ├── instructor.repository.ts# Classe abstrata (Contrato Instrutores)
│   │   ├── appointment.repository.ts# Classe abstrata (Contrato Agendamentos)
│   │   └── mongo/                  # Implementação concreta NoSQL (Mongoose)
│   │       ├── client.repository.mongo.ts
│   │       ├── instructor.repository.mongo.ts
│   │       └── appointment.repository.mongo.ts
│   ├── services/                   # Regras de negócio
│   ├── controllers/                # Camada HTTP e respostas
│   ├── middlewares/                # Autenticação, Autorização e Logger
│   ├── routes/                     # Roteadores Express com Injeção de Repositórios
│   ├── app.ts                      # Configuração do Express
│   └── index.ts                    # Conexão com banco e start do servidor
├── jest.config.js                  # Configurações de testes
├── tsconfig.json                   # Configurações TypeScript
└── package.json                    # Scripts e dependências
🗄️ Modelagem NoSQL (MongoDB - Base FISIOV01)
O banco de dados foi configurado sob o nome FISIOV01 contendo três coleções principais:

1. Coleção clients
_id (String - ID único do domínio)
name (String, obrigatório)
email (String, único, minúsculo)
age (Number, idade)
address (String, endereço)
cpf (String, CPF)
weight (Number, peso em kg)
educationLevel (String, escolaridade)
assignedInstructorId (String, opcional - ID do instrutor designado)
role (String, enum CLIENT)
2. Coleção instructors
_id (String - ID único do domínio)
name (String, obrigatório)
email (String, único)
cpf (String)
specialties (Array de Strings)
crefito (Number - Registro profissional)
role (String, enum INSTRUCTOR)
3. Coleção appointments
_id (String - ID único do agendamento)
clientId (String, referência ao cliente)
instructorId (String, referência ao instrutor)
discipline (String, especialidade)
dateTime (Date, data/hora da consulta)
status (String, enum: 'SCHEDULED', 'RESCHEDULED', 'CANCELED')
⚙️ String de Conexão com o Banco de Dados
Conexão configurada em src/config/database.ts utilizando as credenciais do contêiner Docker:

mongodb://adminfisiomongo:123456INFNET@localhost:27017/FISIOV01?authSource=admin
🚀 Instruções de Execução
1. Subir o Banco de Dados no Docker
Certifique-se de que o contêiner MongoDB esteja ativo na porta 27017.

2. Entrar na Pasta do Projeto
cd FisioV1
3. Instalar Dependências
npm install
4. Executar a Aplicação
npm run dev
Output de confirmação no console:

[FisioV1] Conexão com o MongoDB (FISIOV01) estabelecida com sucesso! 🍃
[FisioV1] Servidor rodando na porta 3000 conectado ao MongoDB 🚀
🧪 Operações do CRUD Suportadas
Inclusão (POST): /clients, /instructors, /appointments -> Salva documentos no MongoDB via Mongoose.
Leitura (GET): /clients, /instructors, /appointments -> Consulta documentos salvos na base FISIOV01.
Alteração (PUT): /clients/:id, /appointments/:id -> Atualiza os dados utilizando $set.
Exclusão (DELETE): /clients/:id, /appointments/:id -> Remove o documento correspondente no MongoDB.