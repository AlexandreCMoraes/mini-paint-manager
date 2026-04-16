// Testa a conectividade com o backend
// Uso: node test-api.js [API_URL]
// Exemplo: node test-api.js http://192.168.15.122:5000

const API_BASE_URL = process.argv[2] || process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Testa a conectividade com o backend fazendo uma requisição simples 
// para o endpoint de miniaturas
async function testApiConnection() {
  try {
    console.log('Testando conexão com:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/miniaturas`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexão bem-sucedida! Miniaturas encontradas:', data.length);
      return true;
    } else {
      console.log('❌ Erro na resposta:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    console.log('💡 Verifique se o backend está rodando e acessível em:', API_BASE_URL);
    return false;
  }
}

testApiConnection();