const express = require('express');
const cors = require('cors');

// Importando nossos Middlewares customizados
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Nosso Middleware de Log
app.use(logger);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        mensagem: '📚 Bem-vindo a API do SESI Leitura!'
    });
});

// Importando rotas
const rotasCadastro = require('./routes/cadastro');
const rotasLeitura = require('./routes/leitura');
const rotasRanking = require('./routes/ranking');

// Utilizando rotas
app.use('/api/auth', rotasCadastro);
app.use('/api/leituras', rotasLeitura);
app.use('/api/ranking', rotasRanking);

// Tratamento de Rotas não encontradas (Erro 404)
app.use((req, res, next) => {
    res.status(404).json({
        mensagem: "Rota não encontrada na API do SESI Leitura."
    });
});

// MIDDLEWARE DE ERROS GLOBAL (Sempre no final!)
app.use(errorHandler);

// Iniciar o servidor
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});