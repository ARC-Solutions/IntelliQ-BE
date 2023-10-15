const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// swagger options
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'IntelliQ-BE API',
            version: '1.0.0',
            description: 'Used for IntelliQ-BE API'
        }
    },
    apis: ['server.js'],
};

// init Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * paths:
 *   /:
 *     get:
 *       tags:
 *         - General
 *       summary: 'Welcome endpoint'
 *       description: 'Returns a welcome message.'
 *       responses:
 *         200:
 *           description: 'Welcome to the IntelliQ-BE API!'
 */
app.get('/', async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API!');
});


const port = process.env.PORT || 3000;
const startServer = async () => {

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

startServer().catch(e => console.error(e));
