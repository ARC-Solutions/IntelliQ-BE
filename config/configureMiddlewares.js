import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

export const configureMiddlewares = (app) => {
    app.use(express.json());
    app.use(cors({
        origin: function (origin, callback) {
            const allowedOrigins = ['http://localhost:3001', 'https://www.intelliq.arc-solutions.xyz', 'https://www.intelliq.dev', 'https://www.beta.intelliq.dev', 'https://www.internal.intelliq.dev', 'https://intelliq-be-s1.azurewebsites.net', 'https://intelliq-be-s2.azurewebsites.net', 'https://intelliq-be-s3.azurewebsites.net'];
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {secure: true},
        })
    );
};
