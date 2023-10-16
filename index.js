import express from 'express';
import { configureMiddlewares } from './config/configureMiddlewares.js';
import { configureSwagger } from './config/swagger.js';
import { startServer } from './config/startServer.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from "./routes/quizRoutes.js";

const app = express();

configureMiddlewares(app);
configureSwagger(app);
authRoutes(app);
quizRoutes(app);

startServer(app).catch(e => console.error(e));
