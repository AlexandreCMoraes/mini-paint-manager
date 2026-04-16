require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const miniaturasRouter = require('./routes/miniaturas');

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

// Middleware
app.use(cors({
  origin: true, // Permite qualquer origem para desenvolvimento
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
  console.log(`Acessível na rede em: http://${getLocalIP()}:${PORT}`);
});
