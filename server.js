const express = require('express');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('Welcome to the API!');
});


const port = process.env.PORT || 3000;
const startServer = async () => {

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

startServer().catch(e => console.error(e));
