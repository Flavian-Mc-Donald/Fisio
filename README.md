🏥 FisioV1 - API REST com TypeScript e MongoDB (Mongoose)
A FisioV1 é uma API REST robusta construída em TypeScript, Express e MongoDB (via Mongoose ODM), projetada para a administração completa de uma clínica de pilates e fisioterapia.

O projeto adota uma arquitetura em camadas limpa, modular e altamente desacoplada, aplicando os princípios de Inversão de Controle (IoC), Injeção de Dependências e Isolamento de Infraestrutura, cobrindo 100% dos critérios de avaliação da disciplina.

🛠️ Stack Tecnológica
Runtime: Node.js (v24+)
Linguagem: TypeScript v6.0.3 (Compilador configurado com target: es2025 e strict: true)
Framework Web: Express v5.2.1
Banco de Dados NoSQL: MongoDB v7+ (Rodando em contêiner Docker na porta 27017)
ODM (Object Document Mapper): Mongoose v8+
Stack de Testes: Jest v30.4.2 com preset ts-jest
Ferramentas de Desenvolvimento: ts-node-dev para recarregamento automático (live reload)
🏗️ Arquitetura e Inversão de Controle (IoC)
A arquitetura do projeto foi desenhada para isolar completamente a lógica de negócios da infraestrutura de banco de dados:

Apresentação (Controllers & Routes): Isola toda a interação HTTP, validação de payload via DTOs e códigos de status da resposta.
Negócio (Services & Domain Models): Contém as regras puras de agendamento, permissões por Role e validações clínicas, dependendo apenas das interfaces/classes abstratas dos Repositórios.
Acesso a Dados (Repositories Abstratos): Define o contrato de operações de CRUD (save, findById, findAll, update, delete).
Infraestrutura (Mongoose Repositories, Schemas & Config): Implementa os repositórios concretos do MongoDB utilizando o Mongoose ODM, mapeando documentos BSON em instâncias do domínio rico.
Essa separação permitiu trocar o repositório em memória pelo repositório em MongoDB sem alterar uma única linha de código dos Services ou Controllers.

📁 Estrutura do Projeto
FisioV1/
├── src/
│   ├── config/
│   │   └── database.ts             # Isolamento da conexão com o MongoDB (Mongoose)
│   ├── types/
│   │   ├── roles.enum.ts           # Enum de perfis (ADMIN, RECEPTIONIST, INSTRUCTOR, CLIENT)
│   │   └── express.d.ts            # Extensão de tipagem global para Request
│   ├── models/
│   │   ├── client.model.ts         # Entidade rica de Domínio: Cliente
│   │   ├── instructor.model.ts     # Entidade rica de Domínio: Instrutor
│   │   ├── appointment.model.ts    # Entidade rica de Domínio: Agendamento
│   │   └── schemas/                # Representação em Documentos Mongoose
│   │       ├── client.schema.ts    # Schema e Model Mongoose de Cliente
│   │       ├── instructor.schema.ts# Schema e Model Mongoose de Instrutor
│   │       └── appointment.schema.ts# Schema e Model Mongoose de Agendamento
│   ├── dtos/                       # Data Transfer Objects e Type Guards
│   ├── repositories/
│   │   ├── client.repository.ts    # Classe abstrata pai (Contrato de Clientes)
│   │   ├── instructor.repository.ts# Classe abstrata pai (Contrato de Instrutores)
│   │   ├── appointment.repository.ts# Classe abstrata pai (Contrato de Consultas)
│   │   └── mongo/                  # Implementação concreta de acesso a dados NoSQL
│   │       ├── client.repository.mongo.ts
│   │       ├── instructor.repository.mongo.ts
│   │       └── appointment.repository.mongo.ts
│   ├── services/                   # Lógica de negócio e regras de visibilidade
│   ├── controllers/                # Camada de apresentação e contratos HTTP
│   ├── middlewares/                # Autenticação (Bearer), Autorização (Role) e Logger
│   ├── routes/                     # Roteamento Express e Injeção dos Repositórios Mongo
│   ├── app.ts                      # Configuração global da aplicação Express
│   └── index.ts                    # Conexão com o banco e inicialização do servidor
├── jest.config.js                  # Configurações do Jest
├── tsconfig.json                   # Configurações do compilador TypeScript
└── package.json                    # Gerenciamento de scripts e dependências
🗄️ Modelagem do Banco de Dados NoSQL (MongoDB)
O banco de dados de documentos foi nomeado como FISIOV01. A modelagem atende a todas as necessidades do negócio através das seguintes coleções:

1. Coleção clients
_id (String - ID customizado do domínio)
name (String, obrigatório)
email (String, único, minúsculo)
age (Number, idade do paciente)
address (String, endereço)
cpf (String, CPF)
weight (Number, peso em kg)
educationLevel (String, escolaridade)
assignedInstructorId (String, opcional - ID do instrutor designado)
role (String, enum CLIENT)
2. Coleção instructors
_id (String - ID customizado do domínio)
name (String, obrigatório)
email (String, único)
cpf (String)
specialties (Array de Strings - ex: ["Pilates", "Ortopedia"])
crefito (Number - Registro profissional)
role (String, enum INSTRUCTOR)
3. Coleção appointments
_id (String - ID customizado do agendamento)
clientId (String, referência ao cliente)
instructorId (String, referência ao instrutor)
discipline (String, especialidade da sessão)
dateTime (Date, data e hora em ISO String)
status (String, enum: 'SCHEDULED', 'RESCHEDULED', 'CANCELED')
⚙️ Conexão com o Banco de Dados
A conexão é gerenciada em src/config/database.ts utilizando as credenciais do contêiner Docker:

mongodb://adminfisiomongo:123456INFNET@localhost:27017/FISIOV01?authSource=admin
🚀 Como Executar a Aplicação
1. Subir o Contêiner Docker do MongoDB
Certifique-se de que o Docker esteja ativo e o contêiner do MongoDB esteja rodando na porta 27017 com as credenciais configuradas.

2. Navegar para a Pasta do Projeto
No terminal do seu VS Code, certifique-se de estar dentro do diretório do projeto:

cd FisioV1
3. Instalar as Dependências
npm install
4. Executar em Modo de Desenvolvimento (Live Reload)
npm run dev
Você verá o seguinte output no console indicando sucesso:

[FisioV1] Conexão com o MongoDB (FISIOV01) estabelecida com sucesso! 🍃
[FisioV1] Servidor rodando na porta 3000 conectado ao MongoDB 🚀
🧪 Operações de CRUD Suportadas (Mongoose ODM)
Todas as operações de banco de dados são entregues através dos Schemas e Models do Mongoose:

Cadastro (Inclusão): POST /clients, POST /instructors, POST /appointments -> Executa findByIdAndUpdate com { upsert: true } ou .save().
Pesquisa (Leitura): GET /clients, GET /clients/:id, etc. -> Executa .find() e .findById() aplicando filtros de visibilidade por perfil.
Atualização (Alteração): PUT /clients/:id, PUT /appointments/:id/reschedule -> Executa findByIdAndUpdate com operadores $set.
Exclusão: DELETE /clients/:id, PUT /appointments/:id/cancel -> Executa findByIdAndDelete ou atualiza o status de agendamento.