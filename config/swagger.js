import swaggerUi from "swagger-ui-express";
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./services/swaggerDefinitions.YAML');

export const configureSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};