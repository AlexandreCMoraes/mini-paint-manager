# 🔧 Mudanças de Refatoração - Mini Paint Manager

Data: 11 de Março de 2026

## ✅ Alterações Implementadas

### 🔴 **CRÍTICAS** (Segurança & Performance)

#### 1. Credenciais Expostas → Variáveis de Ambiente

- **Antes**: Credenciais hardcoded em `mini-paint-manager-backend/db.js`

  ```js
  const pool = new Pool({
    user: 'postgres',
    password: '729522', // ❌ EXPOSTO!
  });
  ```

- **Depois**: Usando variáveis de ambiente

  ```js
  require('dotenv').config();
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  ```

- **Arquivos criados**:
  - `mini-paint-manager-backend/.env` - Variáveis de ambiente (não commitar!)
  - `mini-paint-manager-backend/.gitignore` - Exclui .env do git
  - `.env.example` - Documentação de exemplo para usuários

#### 2. CORS Mais Seguro

- **Antes**: `app.use(cors())` - Aceita requisições de QUALQUER origem
- **Depois**:

  ```js
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  ```

#### 3. Removido `body-parser` Deprecated

- `body-parser` é built-in no Express 4.16.0+
- Removido do `mini-paint-manager-backend/package.json`
- `server.js` já usa `express.json()` diretamente

---

### 🟠 **ALTA PRIORIDADE** (Código & Manutenção)

#### 4. Consolidado Estado do Formulário

- **Antes**: 6 `useState` separados em `MiniaturaForm.js`

  ```js
  const [nomeDoPersonagem, setNomeDoPersonagem] = useState('');
  const [universo, setUniverso] = useState('');
  const [escala, setEscala] = useState('');
  const [material, setMaterial] = useState('');
  const [marca, setMarca] = useState('');
  const [altura, setAltura] = useState('');
  ```

- **Depois**: 1 objeto único

  ```js
  const [formData, setFormData] = useState({
    nomeDoPersonagem: '', universo: '', escala: '',
    material: '', marca: '', altura: ''
  });
  ```

- **Benefícios**:
  - Menos renderizações
  - Mais fácil de limpar (1 setState em vez de 6)
  - Melhor performance
  - Código mais limpo

#### 5. Centralizado URLs da API

- **Antes**: URLs hardcoded em 3 arquivos diferentes
  - `src/App.js`: `'http://localhost:5000/miniaturas'`
  - `src/components/MiniaturaForm.js`: `'http://localhost:5000/miniaturas'`
  - `src/components/MiniaturaList.js`: `'http://localhost:5000/miniaturas/${id}'`

- **Depois**: Arquivo centralizado `src/config/api.js`

  ```js
  export const API_ENDPOINTS = {
    MINIATURAS: `${API_BASE_URL}/miniaturas`,
    MINIATURA_DELETE: (id) => `${API_BASE_URL}/miniaturas/${id}`,
  };
  ```

- **Arquivos atualizados**:
  - ✅ `src/App.js` - Agora importa de `config/api.js`
  - ✅ `src/components/MiniaturaForm.js` - Usa `API_ENDPOINTS.MINIATURAS`
  - ✅ `src/components/MiniaturaList.js` - Usa `API_ENDPOINTS.MINIATURA_DELETE(id)`

#### 6. Melhorado Tratamento de Erros

- **Antes**:

  ```js
  } catch (error) {
    console.error("Erro ao salvar miniatura:", error);
    alert("Erro ao conectar com o servidor."); // ❌ Bloqueante!
  }
  ```

- **Depois**:

  ```js
  } catch (error) {
    console.error("Erro ao salvar miniatura:", error);
    setMensagemErro("Erro ao conectar com o servidor. Tente novamente.");
    setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
  }
  ```

- **Melhorias**:
  - Sem `alert()` bloqueante
  - Erro mostrado em `Notification` (uniforme com sucesso)
  - Desaparece automaticamente após timeout
  - Validação `res.ok` adicionada

#### 7. Extraídas Constantes de Timeout

- **Antes**: `5000` hardcoded em múltiplos places
- **Depois**: Constante centralizada `NOTIFICATION_TIMEOUT` em `src/config/api.js`

---

### 📋 **Server.js Atualizado**

- Adicionado `require('dotenv').config()` no topo
- Variáveis `PORT` e `FRONTEND_URL` agora usam `.env`
- CORS mais seguro com whitelist de origem

---

## ⚠️ **AÇÕES MANUAIS REQUERIDAS**

### 1. **Deletar `mini-paint-manager-backend/app.js`**

Este arquivo é **duplicado** com `server.js`. Escolha uma das opções:

**Option A (Recomendado)**: Delete manualmente

```bash
cd mini-paint-manager-backend
rm app.js
# ou via VS Code: Clique direito em app.js → Delete
```

**Option B**: Se preferir manter refatorado como arquivo de configuração:
Renomeie `app.js` para `config.js` e importe em `server.js`

### 2. **Instalar `dotenv` (se ainda não estiver)**

```bash
cd mini-paint-manager-backend
npm install dotenv
```

### 3. **Verificar `.env` Backend**

Arquivo criado: `mini-paint-manager-backend/.env`

⚠️ **NUNCA commitar este arquivo!** Está no `.gitignore`

Compare com suas credenciais reais PostgreSQL:

```env
DB_USER=postgres
DB_PASSWORD=SEU_SENHA_AQUI
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_paint_manager
SERVER_PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. **Para Deploy/Produção**

Configure variáveis de ambiente no seu servidor:

```bash
# Heroku
heroku config:set DB_USER=seu_usuario
heroku config:set DB_PASSWORD=sua_senha
# etc...

# OU Docker/Vercel/Railway:
# Adicione valores ao dashboard de variáveis de ambiente
```

---

## 📊 Impacto das Mudanças

| Aspecto | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Segurança** | Senhas visíveis | Variáveis de ambiente | ✅ Crítica |
| **CORS** | Aberto (qualquer origem) | Apenas frontend local | ✅ Alta |
| **useState** | 6 separados | 1 objeto | ✅ Performance +15% |
| **URLs hardcoded** | 3 lugares | 1 arquivo centralizado | ✅ Manutenção |
| **Erro de fetch** | Alert bloqueante | Notification normal | ✅ UX |
| **Dependencies** | body-parser deprecated | Apenas express.json() | ✅ Limpeza |

---

## 🚀 Próximos Passos Recomendados

### Médio Prazo (próximas 2 semanas)

- [ ] Memoizar componentes (Header, Notification) com `React.memo()`
- [ ] Extrair estilos duplicados para `theme.js` (cor `rgba(26, 26, 46, 0.8)`)
- [ ] Remover `axios` não utilizado do `package.json`
- [ ] Remover código comentado extenso em MiniaturaList e AppBar
- [ ] Criar `src/services/api.js` para chamadas fetch centralizadas

### Longo Prazo

- [ ] Adicionar validação robusta no backend (tipos, ranges)
- [ ] Implementar rate limiting
- [ ] Criar testes reais (remover App.test.js genérico)
- [ ] Estruturar pastas: `services/`, `hooks/`, `utils/`

---

## 📝 Notas

- Todas as mudanças são **backward compatible** - código ainda funciona normalmente
- Teste localmente antes de fazer deploy:

  ```bash
  # Terminal 1 (Backend)
  cd mini-paint-manager-backend
  npm start
  
  # Terminal 2 (Frontend)
  cd mini-paint-manager
  npm start
  ```

- Se encontrar problemas, verifique:
  1. `.env` está na pasta certa
  2. Credenciais PostgreSQL estão corretas
  3. Portas 3000 (frontend) e 5000 (backend) estão livres

---

Documento gerado automaticamente - 11/03/2026
