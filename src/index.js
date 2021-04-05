const express = require('express');
const path = require('path');

const { IBMWatson } = require('./ibm-watson/IBMWatson');
const { Comentario } = require('./models');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async (request, response) =>{
    response.render('index.html');
});

app.post('/', async (request, response) => {
    const { descricao } = request.body;

    try {
        const comentario = await Comentario.create({ descricao });

        let watson = new IBMWatson(comentario);
        watson.sintetizar(comentario);

        return response.json(comentario);
    } catch (e) {
        await Comentario.destroy({
            where: {
                id: comentario.id
            }
        });
        return response.status(400).json({ error: 'Erro inesperado, o comentário não foi salvo!' });
    }
});

app.get('/listagem', async (request, response) => {
    return response.json(await Comentario.findAll());
});

app.listen(3333, () => {
    console.log('Funcionando na porta 3333');
});