const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');

// RANKING DAS TURMAS
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('leituras')
            .select(`
                minutos,
                usuarios (
                    turma
                )
            `);

        if (error) throw error;

        const ranking = {};

        data.forEach(item => {
            const turma = item.usuarios.turma;

            if (!ranking[turma]) {
                ranking[turma] = 0;
            }
            ranking[turma] += item.minutos;
        });

        const resultado = Object.entries(ranking)
            .map(([turma, minutos]) => ({
                turma,
                minutos
            }))
            .sort((a, b) => b.minutos - a.minutos);

        res.json(resultado);
    } catch (err) {
        next(err);
    }
});

// CONTADOR GERAL
router.get('/contador', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('leituras')
            .select('minutos');

        if (error) throw error;

        const total = data.reduce(
            (soma, leitura) => soma + leitura.minutos,
            0
        );

        res.json({
            sucesso: true,
            total_minutos: total,
            meta: 1000000
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;