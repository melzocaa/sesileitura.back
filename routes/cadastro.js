const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');


// LISTAR USUÁRIOS
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        next(err);
    }
});

// CADASTRAR USUÁRIO
router.post('/', async (req, res, next) => {

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([req.body])
            .select();

        if (error) throw error;

        res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: data[0]
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;