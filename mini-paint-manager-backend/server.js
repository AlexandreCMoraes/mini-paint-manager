// INTERRUPTOR: Responsável apenas por ligar o motor do servidor (app.listen) na porta de rede e 
// carregar o arquivo .env.

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('dotenv').config();
const os = require('os');
const app = require('./app');
const PORT = process.env.SERVER_PORT || 5000;

// Função para obter o IP local da máquina para exibir na inicialização do servidor e 
// facilitar o acesso em redes locais (útil para desenvolvimento e testes em dispositivos
//  móveis na mesma rede) e evitar confusão com o IP localhost que pode não ser 
// acessível de outros dispositivos.
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

app.listen(PORT, '0.0.0.0', () => {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET não definido. Configure essa variável no .env antes de usar autenticação.');
  }
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
  console.log(`Acessível na rede em: http://${getLocalIP()}:${PORT}`);
});
