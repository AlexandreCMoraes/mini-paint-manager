const { Pool } = require('pg');

// Configuração do banco
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mini_paint_manager', // nome do banco
  password: '729522',
  port: 5432,             // porta padrão
});

module.exports = pool;