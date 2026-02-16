const express = require('express');
const cors = require('cors');
const miniaturasRouter = require('./routes/miniaturas');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
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
