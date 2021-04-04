const express = require('express');

const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const path = require('path');
const fs = require("fs");

const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: 'HdAt0znXopSb2GJk_QnVld5WtGZeCfksx0RVJYDEQi95'
    }),
    serviceUrl: 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/72017c23-e1d9-440c-a60b-868f7ed013af',
    disableSslVerification: true
});

const sequelize = new Sequelize(config);
const { Comentario } = require('../models');

try {
    sequelize.authenticate();
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')))

app.get('/', async (request, response) =>{
    response.render('index.html')
});

app.post('/', async (request, response) => {

    const { descricao } = request.body;

    if (descricao.length < 30) {
        return response.status(400).json({ error: 'Necessário ao menos 30 caracteres para um comentário!' })
    }

    const comentario = await Comentario.create({ descricao });

    const synthesizeParams = {
        text: comentario.descricao,
        accept: 'audio/mp3',
        voice: 'pt-BR_IsabelaVoice',
    };

    textToSpeech.synthesize(synthesizeParams)
        .then(response => {
            return textToSpeech.repairWavHeaderStream(response.result);
        })
        .then(buffer => {
            fs.writeFileSync(path.join(__dirname, 'views', 'audio', + comentario.id + '.mp3'), buffer);
        })
        .catch(err => {
            console.log('error:', err);
        });

    return response.json(comentario)
});

app.get('/listagem', async (request, response) => {
    return response.json(await Comentario.findAll());
});

app.listen(3333, () => {
    console.log('Funcionando na porta 3333')
});