import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

export const configureMiddlewares = (app)=> {
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true },
        })
    );
};
