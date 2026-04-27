require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const path = require('path');
const fs = require('fs');
const miniaturesRouter = require('./routes/miniatures');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
console.log('Auth router loaded:', typeof authRouter);
console.log('Users router loaded:', typeof usersRouter);

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Função para obter o IP local da máquina
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Middleware de CORS configurado para permitir requisições de qualquer origem durante o
//  desenvolvimento, e para aceitar credenciais (cookies, headers de autenticação) nas 
// requisições.
app.use(cors({
  origin: true, // Permite qualquer origem para desenvolvimento
  credentials: true
}));
app.use(express.json());

// Rotas do aplicativo, organizadas em arquivos separados para autenticação e operações 
// de miniaturas.
app.use('/auth', authRouter);
app.use('/miniatures', miniaturesRouter);
app.use('/users', usersRouter);

// Teste simples
// app.get('/', (req, res) => {
//   res.send('Backend funcionando!');
// });

// Health-check simples para validar que a API está no ar.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mini-paint-manager-api',
    message: 'API funcionando!',
  });
});

// Em deploy conjunto (frontend + backend na mesma URL), o backend pode
// servir os arquivos estáticos do build React para evitar páginas em branco
// ou respostas de fallback incorretas na rota raiz.
const frontendBuildPath = path.resolve(__dirname, '..', 'build');
const hasFrontendBuild = fs.existsSync(path.join(frontendBuildPath, 'index.html'));

if (hasFrontendBuild) {
  app.use(express.static(frontendBuildPath));

  app.get(/^\/(?!auth|miniatures|users}).*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });

  console.log(`Frontend build detectado em: ${frontendBuildPath}`);
} else {
  console.warn(
    `Build do frontend não encontrado em ${frontendBuildPath}. ` +
    'Se quiser servir frontend e backend juntos, execute "npm run build" na raiz do projeto.'
  );
}


// Iniciar servidor na porta especificada, e exibir mensagens de log para indicar que o 
// servidor está rodando e acessível na rede local, além de verificar se a variável de 
// ambiente JWT_SECRET está definida para garantir que a autenticação funcione 
// corretamente. O servidor é configurado para escutar em todas as interfaces de 
// rede
app.listen(PORT, '0.0.0.0', () => {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET não definido. Configure essa variável no .env antes de usar autenticação.');
  }
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
  console.log(`Acessível na rede em: http://${getLocalIP()}:${PORT}`);
});
