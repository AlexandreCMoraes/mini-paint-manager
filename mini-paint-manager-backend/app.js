// Configuração do servidor Express para a API do Mini Paint Manager. Quais são as rotas, quais middlewares de 
// segurança usar, como tratar erros e como servir os arquivos do frontend.
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const miniaturesRouter = require('./routes/miniatures');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

// Configurações de CORS para permitir requisições do frontend, incluindo cookies para autenticação.
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/miniatures', miniaturesRouter);
app.use('/users', usersRouter);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'mini-paint-manager-api',
        message: 'API funcionando!',
    });
});

const frontendBuildPath = path.resolve(__dirname, '..', 'build');
const hasFrontendBuild = fs.existsSync(path.join(frontendBuildPath, 'index.html'));

if (hasFrontendBuild) {
    app.use(express.static(frontendBuildPath));

    app.get(/^\/(?!auth|miniatures|users).*/, (req, res) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });

    console.log(`Frontend build detectado em: ${frontendBuildPath}`);
} else {
    console.warn(
        `Build do frontend não encontrado em ${frontendBuildPath}. ` +
        'Se quiser servir frontend e backend juntos, execute "npm run build" na raiz do projeto.'
    );
}

module.exports = app;
