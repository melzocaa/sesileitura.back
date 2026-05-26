const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');

// LISTAR LEITURAS
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('leituras')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        next(err);
    }
});


// REGISTRAR LEITURA
router.post('/', async (req, res, next) => {
    try {
        const { usuario_id, minutos } = req.body;

        // BUSCAR TOTAL DO DIA
        const hoje = new Date().toISOString().split('T')[0];

        const { data: leiturasHoje, error: erroBusca } = await supabase
            .from('leituras')
            .select('minutos')
            .eq('usuario_id', usuario_id)
            .eq('data_leitura', hoje);

        if (erroBusca) throw erroBusca;

        const totalHoje = leiturasHoje.reduce(
            (total, leitura) => total + leitura.minutos,
            0
        );

        // VALIDAR LIMITE
        if (totalHoje + minutos > 16) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Limite diário de 16 minutos excedido.'
            });
        }

        // INSERIR LEITURA
        const { data, error } = await supabase
            .from('leituras')
            .insert([
                {
                    usuario_id,
                    minutos,
                    data_leitura: hoje
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            sucesso: true,
            mensagem: 'Leitura registrada com sucesso!',
            leitura: data[0]
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;