const express = require('express');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
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

const app = express();

app.use(express.json());

app.get('/', (request, response) =>{
    textToSpeech.synthesize(synthesizeParams)
        .then(response => {
            console.log('aqui')
            return textToSpeech.repairWavHeaderStream(response.result);
        })
        .then(buffer => {
            fs.writeFileSync('hello_world.mp3', buffer);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.listen(3333, () => {
    console.log('Funcionando na porta 3333')
});