// CONECTOR: Cria e gerencia a conexão direta (Pool de conexões) com o banco de 
// dados PostgreSQL.

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('dotenv').config();
const { Pool } = require('pg');

// Configuração do banco usando variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;