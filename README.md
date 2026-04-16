<!-- # Mini Paint Manager

Sistema web para gerenciar o cadastro e a listagem de miniaturas.  
Este projeto é parte da disciplina de Projeto de Software, primeira entrega (AC1).

O sistema possui as seguintes funcionalidades implementadas até agora:

1. **Cadastro de Miniatura (CREATE)**  
   - Formulário com os campos: Nome, Universo, Escala, Material, Marca, Altura  
   - Validação para impedir envio de campos vazios

2. **Listagem Dinâmica (READ)**  
   - As miniaturas cadastradas aparecem em tempo real  
   - Renderização automática ao adicionar nova miniatura

3. **Feedback Visual**  
   - Mensagens de erro caso os campos estejam incompletos  
   - Mensagem de sucesso exibindo o nome da miniatura adicionada

4. **Layout Futurista**  
   - Interface com cores neon e estilo moderno para melhor experiência visual

---

## Rodando o projeto

No diretório do projeto, você pode executar:

### `npm install`

Instala as dependências do projeto.

### `npm start`

Roda o app em modo desenvolvimento.  
Abra [http://localhost:3000](http://localhost:3000) para visualizar.

### `npm run start:network`

Roda o app em modo desenvolvimento acessível na rede local.  
Isso permite acessar o app de outros dispositivos na mesma rede (celular, outro computador).

O app estará disponível em:  
- `http://SEU_IP_LOCAL:3000` (exemplo: `http://192.168.1.100:3000`)

Para descobrir seu IP local, execute no terminal:  
- Windows: `ipconfig`  
- Linux/Mac: `ifconfig` ou `ip addr`

**Nota**: Certifique-se de que o firewall permite conexões na porta 3000.

### `npm run get-ip`

Mostra seu IP local na rede para compartilhar o acesso com outros dispositivos.

### `npm run test-api [URL]`

Testa a conectividade com o backend API.  
Exemplo: `npm run test-api http://192.168.1.100:5000`

## Rodando o Backend

### Pré-requisitos

- Node.js instalado
- PostgreSQL configurado (ver arquivo `.env` para configurações)

### Configuração

1. **Copie o arquivo de exemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Configure as variáveis no `.env`**:
   - `DB_USER`: usuário do PostgreSQL
   - `DB_PASSWORD`: senha do PostgreSQL
   - `DB_HOST`: host do banco (localhost para desenvolvimento)
   - `DB_PORT`: porta do PostgreSQL (padrão: 5432)
   - `DB_NAME`: nome do banco de dados

---

No diretório `mini-paint-manager-backend`:

### `npm install`

Instala as dependências do backend.

### `npm start`

Inicia o servidor backend.  
O servidor estará disponível em:  
- `http://localhost:5000` (local)  
- `http://SEU_IP_LOCAL:5000` (rede local)

O backend já está configurado para aceitar conexões da rede local.

---

## Segurança e Acesso Remoto

### Acesso na Rede Local
O projeto está configurado para funcionar na rede local. Para maior segurança:

1. **Firewall**: Certifique-se de que apenas as portas 3000 (frontend) e 5000 (backend) estão abertas
2. **CORS**: Em produção, configure origens específicas no backend em vez de `origin: true`
3. **HTTPS**: Para produção, use HTTPS com certificados válidos

### Acesso Fora da Rede Local
Para compartilhar com dispositivos fora da sua rede Wi-Fi:

#### Opção 1: Port Forwarding (Recomendado para desenvolvimento)
1. Configure o roteador para redirecionar portas externas para seu IP local
2. Exemplo: Porta externa 3000 → IP interno:3000, Porta externa 5000 → IP interno:5000
3. Use seu IP público (verifique em whatismyip.com)
4. Configure `REACT_APP_API_URL` no `.env.local` com seu domínio/IP público

#### Opção 2: Ngrok (Fácil para testes)
1. Instale ngrok: `npm install -g ngrok`
2. Inicie o backend: `ngrok http 5000`
3. Inicie o frontend: `ngrok http 3000`
4. Use as URLs geradas pelo ngrok
5. Configure `REACT_APP_API_URL` no `.env.local`

#### Opção 3: Hospedagem em Nuvem
- Deploy o backend em serviços como Heroku, Railway, ou Vercel
- Configure o domínio no `REACT_APP_API_URL`

**⚠️ Aviso**: Acesso remoto sem HTTPS pode expor dados. Use apenas para desenvolvimento/testes.

---

- Implementar backend e conexão com banco de dados (AC2 e AC3)
- Adicionar funcionalidades extras, como edição e remoção de miniaturas (AC2)
- Upload de imagens e filtros avançados (AC4 – prova)

---

## Observações

- Este projeto foi criado utilizando **Create React App**.  
- Para aprender mais sobre React, consulte [React documentation](https://reactjs.org/).  
- Para informações sobre CRA, consulte [Create React App Docs](https://facebook.github.io/create-react-app/docs/getting-started).

---

## Créditos

Desenvolvido por Alexandre Moraes como parte do projeto de disciplina Projeto de Software. -->

# Mini Paint Manager 🖌️🎨

Sistema web para gerenciar o cadastro e a listagem de miniaturas pintadas.  

Este projeto é parte da disciplina **Projeto de Software**, primeira entrega (AC1).

O sistema possui as seguintes funcionalidades implementadas até agora:

---

## Funcionalidades AC1

1. **Cadastro de Miniatura (CREATE) 📝**
   - Formulário com os campos:
     - **Nome** 🖋️
     - **Universo** 🌌
     - **Escala** 📏
     - **Material** 🧱
     - **Marca** 🏷️
     - **Altura** 📐
   - **Validação**: impede envio de campos vazios
   - **Feedback visual**:
     - Mensagem de erro se algum campo estiver vazio ❌
     - Mensagem de sucesso mostrando o nome da miniatura adicionada ✅

2. **Listagem Dinâmica (READ) 📃**
   - Miniaturas cadastradas aparecem em tempo real
   - Renderização automática ao adicionar nova miniatura

3. **Persistência de Dados no Banco de Dados 💾**
   - Backend implementado com **Node.js + Express**
   - Banco de dados **PostgreSQL**
   - Dados salvos na tabela `miniaturas` no PostgreSQL
   - Inclusão de novas miniaturas e listagem de dados funcionando
   - **Observação**: Edição e exclusão de miniaturas serão implementadas nas próximas atividades

4. **Layout Futurista 🌐**
   - Interface moderna com cores neon e estilo futurista
   - Melhor experiência visual para o usuário

---

## Estrutura do Projeto 📂

# Mini Paint Manager 🖌️🎨

Sistema web para gerenciar o cadastro e a listagem de miniaturas pintadas.  

Este projeto é parte da disciplina **Projeto de Software**, primeira entrega (AC1).

O sistema possui as seguintes funcionalidades implementadas até agora:

---

## Funcionalidades AC1

1. **Cadastro de Miniatura (CREATE) 📝**
   - Formulário com os campos:
     - **Nome** 🖋️
     - **Universo** 🌌
     - **Escala** 📏
     - **Material** 🧱
     - **Marca** 🏷️
     - **Altura** 📐
   - **Validação**: impede envio de campos vazios
   - **Feedback visual**:
     - Mensagem de erro se algum campo estiver vazio ❌
     - Mensagem de sucesso mostrando o nome da miniatura adicionada ✅

2. **Listagem Dinâmica (READ) 📃**
   - Miniaturas cadastradas aparecem em tempo real
   - Renderização automática ao adicionar nova miniatura

3. **Persistência de Dados no Banco de Dados 💾**
   - Backend implementado com **Node.js + Express**
   - Banco de dados **PostgreSQL**
   - Dados salvos na tabela `miniaturas` no PostgreSQL
   - Inclusão de novas miniaturas e listagem de dados funcionando
   - **Observação**: Edição e exclusão de miniaturas serão implementadas nas próximas atividades

4. **Layout Futurista 🌐**
   - Interface moderna com cores neon e estilo futurista
   - Melhor experiência visual para o usuário

---

## Estrutura do Projeto 📂

mini-paint-manager/
├─ mini-paint-manager/ # Frontend (React)
│ ├─ src/
│ │ ├─ components/ # Componentes React
│ │ │ ├─ MiniaturaForm.js # Formulário de cadastro
│ │ │ ├─ MiniaturaList.js # Listagem dinâmica
│ │ │ └─ ... outros
│ │ └─ App.js # Componente principal
│ └─ package.json
├─ mini-paint-manager-backend/ # Backend (Node + Express)
│ ├─ routes/
│ │ └─ miniaturas.js # Rotas para CRUD de miniaturas
│ ├─ db.js # Conexão com PostgreSQL
│ ├─ app.js # Servidor Express
│ └─ package.json
└─ README.md

---

## Tecnologias Utilizadas 🛠️

- **Frontend**: React.js (via Create React App)
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Comunicação Front-End / Back-End**: Axios / Fetch
- **Outras dependências**: Material-UI para componentes visuais

---

## Passo a Passo para Rodar o Projeto ▶️

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>

## Tecnologias Utilizadas 🛠️

- **Frontend**: React.js (via Create React App)
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Comunicação Front-End / Back-End**: Axios / Fetch
- **Outras dependências**: Material-UI para componentes visuais

---

## Passo a Passo para Rodar o Projeto ▶️

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>

cd mini-paint-manager-backend
npm install

Configure a conexão com o PostgreSQL no arquivo db.js:

const { Pool } = require('pg');
const pool = new Pool({
  user: 'SEU_USUARIO',
  host: 'localhost',
  database: 'mini_paint_manager',
  password: 'SUA_SENHA',
  port: 5432,
});
module.exports = pool;

Crie a tabela miniaturas no banco:

CREATE TABLE miniaturas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  universo VARCHAR(100) NOT NULL,
  escala VARCHAR(50) NOT NULL,
  material VARCHAR(50) NOT NULL,
  marca VARCHAR(50) NOT NULL,
  altura NUMERIC NOT NULL
);

Rode o backend:

node app.js

O servidor estará rodando em http://localhost:5000


---

✅ Esse README cobre **tudo que precisa para rodar o projeto e entender o que foi implementado** na AC1.  
- Frontend: formulário, validação, feedback visual, listagem dinâmica  
- Backend: Node + Express + PostgreSQL  
- Próximos passos: AC2, AC3, AC4  
- Estrutura de pastas e dependências  
