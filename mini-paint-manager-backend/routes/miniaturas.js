const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db');


// Caminho do JSON
const dataPath = path.join(__dirname, '../data/miniaturas.json');

// GET: listar miniaturasdb
// Retornar status code (200 por padrão está ok).
// Adicionar mensagem de erro JSON, ao invés de texto, facilita o front.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM miniaturas ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar miniaturas' });
  }
});

// POST: adicionar miniaturadb
// Validação de campos obrigatórios (retorna 400 se faltar algo).
// try/catch para não quebrar o servidor.
// Status code adequado (201).
router.post('/', async (req, res) => {
  const { nomeDoPersonagem, universo, escala, material, marca, altura } = req.body;
  // Validação básica de campos
  if (!nomeDoPersonagem || !universo || !escala || !material || !marca || !altura) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO miniaturas (nome, universo, escala, material, marca, altura, data_criacao) VALUES ($1,$2,$3,$4,$5,$6, NOW()) RETURNING *',
      [nomeDoPersonagem, universo, escala, material, marca, altura]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar miniatura' });
  }
});

// DELETE: deletar miniaturadb
// Checa se a miniatura existe (rowCount === 0) e retorna 404 se não existir.
// try/catch para capturar erros do banco.
// Retorna os dados da miniatura deletada (RETURNING *), para frontend.
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Deleta e retorna a miniatura removida
    const result = await pool.query(
      'DELETE FROM miniaturas WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Miniatura não encontrada' });
    }

    res.json({ message: 'Miniatura deletada com sucesso', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar a miniatura' });
  }
});

module.exports = router;
