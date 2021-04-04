const express = require('express');
const expressBrowserify = require('express-browserify');

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

const synthesizeParams = {
    text: 'Oi meu Brasil baronio',
    accept: 'audio/mp3',
    voice: 'pt-BR_IsabelaVoice',
};

const sequelize = new Sequelize(config);
const { Comentario } = require('../models');

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
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

    console.log(request.body);

    const comentario = await Comentario.create(request.body);

    response.json(comentario)


    // textToSpeech.synthesize(synthesizeParams)
    //     .then(response => {
    //         console.log('aqui')
    //         return textToSpeech.repairWavHeaderStream(response.result);
    //     })
    //     .then(buffer => {
    //         fs.writeFileSync('hello_world.mp3', buffer);
    //     })
    //     .catch(err => {
    //         console.log('error:', err);
    //     });
});

app.listen(3333, () => {
    console.log('Funcionando na porta 3333')
});