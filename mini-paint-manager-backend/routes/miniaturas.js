const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Caminho do JSON
const dataPath = path.join(__dirname, '../data/miniaturas.json');

// GET: lista todas as miniaturas
router.get('/', (req, res) => {
  const miniaturas = JSON.parse(fs.readFileSync(dataPath));
  res.json(miniaturas);
});

// POST: adiciona nova miniatura
router.post('/', (req, res) => {
  const miniaturas = JSON.parse(fs.readFileSync(dataPath));
  const newMini = {
    id: miniaturas.length + 1,
    ...req.body
  };
  miniaturas.push(newMini);
  fs.writeFileSync(dataPath, JSON.stringify(miniaturas, null, 2));
  res.status(201).json(newMini);
});

// DELETE: remove uma miniatura por ID
router.delete('/:id', (req, res) => {
  const miniaturas = JSON.parse(fs.readFileSync(dataPath));
  const id = parseInt(req.params.id);
  const index = miniaturas.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Miniatura não encontrada' });
  }
  
  miniaturas.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(miniaturas, null, 2));
  res.json({ message: 'Miniatura deletada com sucesso' });
});

module.exports = router;
