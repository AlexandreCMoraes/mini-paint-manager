const os = require('os');

// Função para obter o IP local da máquina na rede
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'Não foi possível determinar o IP local';
}

console.log('Seu IP local na rede:', getLocalIP());
console.log('Use este IP para acessar o projeto de outros dispositivos:');
console.log('- Frontend: http://' + getLocalIP() + ':3000');
console.log('- Backend: http://' + getLocalIP() + ':5000');