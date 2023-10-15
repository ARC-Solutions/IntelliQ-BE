const express = require('express');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('Welcome to the API!');
});
