const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const path = require('path');
const fs = require("fs");

class IBMWatson
{
    constructor(comentario)
    {
        this.textToSpeech = new TextToSpeechV1({
            authenticator: new IamAuthenticator({
                apikey: 'HdAt0znXopSb2GJk_QnVld5WtGZeCfksx0RVJYDEQi95'
            }),
            serviceUrl: 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/72017c23-e1d9-440c-a60b-868f7ed013af',
            disableSslVerification: true
        });

        this.synthesizeParams = {
            text: comentario.descricao,
            accept: 'audio/mp3',
            voice: 'pt-BR_IsabelaVoice',
        };
    }

    sintetizar(comentario)
    {
        this.textToSpeech.synthesize(this.synthesizeParams)
            .then(response => {
                return this.textToSpeech.repairWavHeaderStream(response.result);
            })
            .then(buffer => {
                fs.writeFileSync(path.join(__dirname, '../', 'views', 'audio', + comentario.id + '.mp3'), buffer);
            })
            .catch(err => {
                console.log('error:', err);
            });
    }
}

module.exports = { IBMWatson };