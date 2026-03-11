const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../db');


// Caminho do JSON
const dataPath = path.join(__dirname, '../data/miniaturas.json');

// GET: lista todas as miniaturas
// router.get('/', (req, res) => {
//   const miniaturas = JSON.parse(fs.readFileSync(dataPath));
//   res.json(miniaturas);
// });

// GET: listar miniaturasdb
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM miniaturas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// POST: adiciona nova miniatura
// router.post('/', (req, res) => {
//   const miniaturas = JSON.parse(fs.readFileSync(dataPath));
//   const newMini = {
//     id: miniaturas.length + 1,
//     ...req.body
//   };
//   miniaturas.push(newMini);
//   fs.writeFileSync(dataPath, JSON.stringify(miniaturas, null, 2));
//   res.status(201).json(newMini);
// });

// POST: adicionar miniaturadb
router.post('/', async (req, res) => {
  const { nomeDoPersonagem, universo, escala, material, marca, altura } = req.body;
  const result = await pool.query(
    'INSERT INTO miniaturas (nome, universo, escala, material, marca, altura, data_criacao) VALUES ($1,$2,$3,$4,$5,$6, NOW()) RETURNING *',
    [nomeDoPersonagem, universo, escala, material, marca, altura]
  );
  res.json(result.rows[0]);
});

// DELETE: remove uma miniatura por ID
// router.delete('/:id', (req, res) => {
//   const miniaturas = JSON.parse(fs.readFileSync(dataPath));
//   const id = parseInt(req.params.id);
//   const index = miniaturas.findIndex(m => m.id === id);
  
//   if (index === -1) {
//     return res.status(404).json({ message: 'Miniatura não encontrada' });
//   }
  
//   miniaturas.splice(index, 1);
//   fs.writeFileSync(dataPath, JSON.stringify(miniaturas, null, 2));
//   res.json({ message: 'Miniatura deletada com sucesso' });
// });

// DELETE: deletar miniaturadb
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM miniaturas WHERE id=$1', [id]);
  res.json({ message: 'Miniatura deletada com sucesso' });
});

module.exports = router;
