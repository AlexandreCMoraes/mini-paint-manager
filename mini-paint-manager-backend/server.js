require('dotenv').config();
const express = require('express');
const cors = require('cors');
const miniaturasRouter = require('./routes/miniaturas');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/miniaturas', miniaturasRouter);

// Teste simples
app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
