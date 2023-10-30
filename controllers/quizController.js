import { generateQuizQuestions } from "../services/quizService.js";
import { prisma } from "../config/prismaClient.js";
import {json} from "express";

export const welcome =  async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API! For Documentation please visit: intelliq-be.azurewebsites.net/api-docs/');
};

export const getQuiz = async (req, res) => {
    const { interests, numberOfQuestions } = req.query;
    const rawQuestions = await generateQuizQuestions(interests, numberOfQuestions);
    res.json({ rawQuestions });
};

export const getFormulaOneQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('formula-one', 4);
    req.rawQuestions = questions;
    res.json({ rawQuestions: questions });
    // next();
};

export const getAnimeQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('anime', 4);
    req.rawQuestions = questions;
    res.json({ rawQuestions: questions });
    // next();
};

export const getJSQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('javascript', 4);
    req.rawQuestions = questions;
    res.json({ rawQuestions: questions });
    // next();
};

export const getGamingQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('gaming', 4);
    req.rawQuestions = questions;
    res.json({ rawQuestions: questions });
    // next();
};

export const getCSSQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('css', 4);
    req.rawQuestions = questions;
    res.json({ rawQuestions: questions });
    // next();
};

export const getAgileQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('agile-management', 4);
    req.rawQuestions = questions;
    res.json({ rawQuestions: questions });
    // next();
};