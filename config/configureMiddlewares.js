import express from "express";
import cors from "cors";

export const configureMiddlewares = (app)=> {
    app.use(express.json());
    app.use(cors());
};