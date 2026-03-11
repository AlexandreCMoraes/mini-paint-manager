const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const miniaturasRouter = require('./routes/miniaturas');

// app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

app.use('/miniaturas', miniaturasRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));