const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (request, response) =>{
    return response.json({message: 'oi'});
});

app.listen(3333, () => {
    console.log('Funcionando na porta 3333')
});