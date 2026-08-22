# 🏥 FisioV1 - API REST de Administração para Clínica de Pilates e Fisioterapia

A **FisioV1** é uma API REST robusta construída em **TypeScript** e **Express**, projetada para a administração completa de uma clínica de pilates e fisioterapia. O projeto adota uma arquitetura em camadas bem-definida e limpa, dividida por responsabilidades claras (Middlewares, Controllers, Services, Repositories, DTOs, Enums e Models de Domínio), seguindo fielmente as boas práticas de desenvolvimento orientado a objetos (OOP) e injeção de dependências demonstradas em aula.

O sistema possui regras rígidas de segurança por perfis de acesso (**Roles**), controle estrito de visibilidade de dados e uma stack completa de testes automatizados unitários e de integração utilizando o **Jest**.

---

## 🛠️ Stack Tecnológica

*   **Runtime:** Node.js (v24+)
*   **Linguagem:** TypeScript v6.0.3 (Compilador configurado com `target: es2025` e `strict: true`)
*   **Framework Web:** Express v5.2.1
*   **Stack de Testes:** Jest v30.4.2 com preset `ts-jest` v29.4.12 (Configurado with `isolatedModules: true`)
*   **Ferramentas de Desenvolvimento:** `ts-node-dev` para recarregamento automático (live reload)

---

## 📁 Estrutura do Projeto

O código-fonte do projeto está estruturado de forma modular e escalável, dividindo as atribuições de cada camada de maneira isolada:

```text
FisioV1/
├── src/
│   ├── types/
│   │   ├── roles.enum.ts       # Enum de perfis de usuário (ADMIN, RECEPTIONIST, INSTRUCTOR, CLIENT)
│   │   └── express.d.ts        # Extensão de tipagem global para o Request do Express
│   ├── models/
│   │   ├── client.model.ts     # Entidade de Domínio: Cliente (OOP com encapsulamento e validações)
│   │   ├── instructor.model.ts # Entidade de Domínio: Instrutor
│   │   └── appointment.model.ts# Entidade de Domínio: Consulta (Lógica de negócios e regras temporais)
│   ├── dtos/
│   │   ├── client.dto.ts       # Interface de entrada e Type Guard (isCreateClientDTO)
│   │   ├── instructor.dto.ts   # Interface de entrada e Type Guard (isCreateInstructorDTO)
│   │   └── appointment.dto.ts  # Interface de entrada e Type Guard (isCreateAppointmentDTO)
│   ├── repositories/
│   │   ├── client.repository.ts       # Classe abstrata e implementação em memória do repositório de Clientes
│   │   ├── instructor.repository.ts   # Classe abstrata e implementação em memória do repositório de Instrutores
│   │   └── appointment.repository.ts  # Classe abstrata e implementação em memória do repositório de Consultas
│   ├── services/
│   │   ├── client.service.ts     # Serviço de Clientes: Regras de visibilidade e injeção de dependências
│   │   ├── instructor.service.ts # Serviço de Instrutores
│   │   └── appointment.service.ts# Serviço de Consultas: Regras críticas de conflitos e disciplinas
│   ├── controllers/
│   │   ├── client.controller.ts       # Controlador de Clientes (Status HTTP e mapeamento DTO)
│   │   ├── instructor.controller.ts   # Controlador de Instrutores
│   │   └── appointment.controller.ts  # Controlador de Consultas
│   ├── middlewares/
│   │   ├── log.middleware.ts    # Interceptador customizado para logs de requisições no console
│   │   ├── auth.middleware.ts   # Decodificador de Bearer Token e identificação do usuário
│   │   └── role.middleware.ts   # Validador dinâmico de privilégios por Role
│   ├── routes/
│   │   ├── client.routes.ts     # Rotas e Middleware Chain do módulo de Clientes
│   │   ├── instructor.routes.ts # Rotas e Middleware Chain do módulo de Instrutores
│   │   └── appointment.routes.ts# Rotas e Middleware Chain do módulo de Consultas
│   ├── app.ts                  # Configuração global da aplicação Express e middlewares
│   ├── index.ts                # Inicialização do servidor na porta 3000
│   └── __tests__/
│       ├── canary.test.ts       # Teste de fumaça (Canário)
│       ├── domain.test.ts       # Testes unitários das entidades de domínio e validações de DTO
│       ├── repository.test.ts   # Testes unitários dos repositórios em memória
│       ├── security.test.ts     # Testes unitários de autenticação e autorização
│       ├── service.test.ts      # Testes unitários de regras de negócio (Services)
│       └── integration.test.ts  # Testes de integração E2E com Supertest
├── jest.config.js              # Configuração detalhada do Jest
├── tsconfig.json               # Configuração detalhada do compilador TypeScript
└── package.json                # Gerenciamento de scripts e dependências
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de possuir o **Node.js** (versão 24 ou superior) instalado em sua máquina.

### 2. Instalação das Dependências
Navegue até a pasta raiz `FisioV1` através do terminal e execute:
```bash
npm install
```

### 3. Executando em Modo de Desenvolvimento (Live Reload)
Para iniciar o servidor em ambiente local com recarregamento automático ao modificar arquivos:
```bash
npm run dev
```
O console exibirá a seguinte mensagem:
`[FisioV1] Servidor rodando com sucesso na porta 3000 🚀`

### 4. Compilando o Projeto (TypeScript para JavaScript)
Gera o build estático de produção compilando todo o código TypeScript para a pasta `dist/` se não houver erros de tipo:
```bash
npm run build
```

### 5. Executando em Produção (JavaScript Compilado)
Inicia o projeto diretamente a partir dos arquivos compilados em JavaScript:
```bash
npm run start
```

---

## 🧪 Suíte de Testes Automatizados

A stack de testes foi dividida de maneira modular para validar as regras do sistema de forma veloz e isolada, seguindo o padrão **AAA (Arrange, Act, Assert)**.

### Executar todos os testes (Unitários e Integração)
```bash
npm test
```

### Executar testes em modo "Watch" (Observador)
Mantém o Jest ativo reexecutando os testes de forma automática a cada alteração no código:
```bash
npm run test:watch
```

---

## 🛡️ Segurança: Autenticação e Autorização

### 1. Mecanismo de Autenticação (Bearer Token)
As rotas de negócios estão protegidas pelo `authMiddleware`. Ele intercepta o cabeçalho HTTP `Authorization` buscando o formato:
`Authorization: Bearer <userId>:<ROLE>`

*   **Padrão do Token:** Para facilidade de desenvolvimento e simulação nos testes, o token é composto pelo ID do usuário seguido de `:` e o seu respectivo papel (UserRole).
*   **Exemplos de Tokens Válidos:**
    *   `admin1:ADMIN` (Perfil Administrador)
    *   `receptionist1:RECEPTIONIST` (Perfil Recepcionista)
    *   `inst1:INSTRUCTOR` (Perfil Instrutor)
    *   `cli1:CLIENT` (Perfil Cliente)

Ao decodificar o token com sucesso, os dados são anexados ao objeto `Request` do Express de forma tipada (`req.userId` e `req.role`), permitindo que as camadas subsequentes façam verificações baseadas em quem disparou a chamada.

### 2. Mecanismo de Autorização Dinâmica (`UserRole`)
O enum `UserRole` (em `src/types/roles.enum.ts`) define os quatro papéis de acesso:
1.  **`ADMIN`:** Acesso irrestrito a todas as operações de criação, leitura, alteração e deleção.
2.  **`RECEPTIONIST`:** Acesso operacional de recepção (cria, edita, deleta e consulta todos os clientes e instrutores, além de agendar consultas).
3.  **`INSTRUCTOR`:** Acesso limitado aos dados clínicos (visualiza e lista apenas os alunos especificamente vinculados/designados ao seu ID de instrutor). Não pode editar cadastros nem criar/cancelar agendamentos diretamente.
4.  **`CLIENT`:** Acesso estrito ao próprio perfil (só pode ler e alterar seus próprios dados de cadastro, exceto mudar seu próprio instrutor designado. Só pode agendar, reagendar ou cancelar consultas para si mesmo).

---

## 📋 Mapeamento de Rotas da API e Permissões

### 1. Módulo de Clientes (`/clients`)

| Método | Rota | Descrição | Permissão (Roles) | Detalhes da Regra de Negócio |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/clients` | Cria um novo Cliente | `ADMIN`, `RECEPTIONIST` | Valida todos os campos obrigatórios pelo `isCreateClientDTO` e garante que o e-mail não seja duplicado. |
| **GET** | `/clients` | Lista os Clientes | `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR` | Se o solicitante for um `INSTRUCTOR`, o serviço filtra e retorna **apenas** os clientes especificamente designados a ele. |
| **GET** | `/clients/:id` | Busca Cliente por ID | `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR`, `CLIENT` | Se o solicitante for `CLIENT`, ele **só** pode buscar o próprio ID (erro `403` se tentar ver outro). Se for `INSTRUCTOR`, só pode buscar se o cliente estiver designado a ele. |
| **PUT** | `/clients/:id` | Atualiza um Cliente | `ADMIN`, `RECEPTIONIST`, `CLIENT` | Se o solicitante for `CLIENT`, ele só pode alterar a si mesmo e está **proibido** de alterar o campo `assignedInstructorId` (erro `403`). |
| **DELETE**| `/clients/:id` | Remove um Cliente | `ADMIN`, `RECEPTIONIST` | Deleta fisicamente o cliente em memória. |

### 2. Módulo de Instrutores (`/instructors`)

| Método | Rota | Descrição | Permissão (Roles) | Detalhes da Regra de Negócio |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/instructors` | Cria um novo Instrutor | `ADMIN`, `RECEPTIONIST` | Valida especialidades, CPF estrutural e o registro profissional obrigatório (`crefito`). |
| **GET** | `/instructors` | Lista os Instrutores | `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR`, `CLIENT` | Retorna todos os instrutores cadastrados e suas especialidades (útil para o cliente escolher no agendamento). |
| **GET** | `/instructors/:id` | Busca Instrutor por ID | `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR`, `CLIENT` | Retorna os detalhes do instrutor específico. |
| **PUT** | `/instructors/:id` | Atualiza um Instrutor | `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR` | Atualiza especialidades, e-mail, nome, CPF ou CREFITO. |
| **DELETE**| `/instructors/:id` | Remove um Instrutor | `ADMIN`, `RECEPTIONIST` | Remove o cadastro do profissional em memória. |

### 3. Módulo de Consultas/Agendamentos (`/appointments`)

| Método | Rota | Descrição | Permissão (Roles) | Detalhes da Regra de Negócio |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/appointments` | Agenda uma Consulta | `ADMIN`, `RECEPTIONIST`, `CLIENT` | **Regras Críticas:** <br>1. Se for `CLIENT`, ele só pode agendar para o próprio ID.<br>2. O instrutor selecionado **deve** possuir a disciplina informada no seu array de especialidades.<br>3. Impede choque de horários (o mesmo instrutor não pode ter outra consulta agendada no mesmo dia e hora). |
| **GET** | `/appointments` | Lista Agendamentos | `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR`, `CLIENT` | **Filtragem Inteligente:**<br>- `CLIENT` só lista seus próprios agendamentos.<br>- `INSTRUCTOR` só lista os agendamentos agendados com ele.<br>- `ADMIN`/`RECEPTIONIST` listam todos de forma irrestrita. |
| **GET** | `/appointments/:id`| Busca Agendamento por ID| `ADMIN`, `RECEPTIONIST`, `INSTRUCTOR`, `CLIENT` | Retorna detalhes da consulta respeitando a propriedade (cliente vê a sua, instrutor vê a dele, recepção/admin veem todas). |
| **PUT** | `/appointments/:id/reschedule` | Reagenda uma Consulta | `ADMIN`, `RECEPTIONIST`, `CLIENT` | Altera a data/hora da consulta. Aplica as mesmas regras de prevenção de choque de horários e impede reagendamento para datas passadas. Atualiza o status para `RESCHEDULED`. |
| **PUT** | `/appointments/:id/cancel` | Cancela uma Consulta | `ADMIN`, `RECEPTIONIST`, `CLIENT` | Atualiza o status da consulta para `CANCELED`, liberando a agenda do instrutor para novos marcações naquele horário. |

### 4. Rota Pública de Integridade
*   **GET** `/canary-check`: Rota pública para averiguar a integridade do webservice Express e verificação rápida de integridade da API da Clínica FisioV1.

---

## 📝 Contratos de Entrada (Payloads DTO)

### Criação de Cliente (`CreateClientDTO`)
O payload deve possuir rigorosamente a seguinte estrutura em formato JSON:
```json
{
  "name": "Maria Oliveira Souza",
  "email": "maria.souza@email.com",
  "age": 34,
  "address": "Avenida Paulista, 1500 - Bela Vista - SP",
  "cpf": "111.222.333-44",
  "weight": 62.5,
  "educationLevel": "Ensino Superior Completo",
  "assignedInstructorId": "inst_xyz89" // Opcional
}
```

### Criação de Instrutor (`CreateInstructorDTO`)
```json
{
  "name": "Dr. Rodrigo Alencar",
  "email": "rodrigo.alencar@fisiov1.com",
  "cpf": "999.888.777-66",
  "specialties": ["Pilates", "Fisioterapia Pélvica", "Ortopedia"],
  "crefito": 45672
}
```

### Criação de Consulta (`CreateAppointmentDTO`)
```json
{
  "clientId": "cli_abc12",
  "instructorId": "inst_xyz89",
  "discipline": "Pilates",
  "dateTime": "2026-09-15T14:30:00.000Z" // Deve ser data futura estruturada em formato ISO string
}
```

---

## 🪵 Middleware de Logs Customizado

Todas as requisições que chegam à API passam pelo `logMiddleware` antes de serem roteadas. Ele captura o timestamp ISO, o método HTTP (GET, POST, PUT, DELETE) e a URL exata do recurso acessado, registrando esses dados de forma limpa no terminal em tempo real.

**Exemplo de Log gerado no Console:**
```text
[2026-08-22T17:05:14.281Z] GET /clients
[2026-08-22T17:05:22.115Z] POST /appointments
[2026-08-22T17:05:40.890Z] PUT /appointments/app_r8d2a/reschedule
```