import { generateQuizQuestions } from "../services/quizService.js";

export const welcome =  async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API! For Documentation please visit: intelliq-be.azurewebsites.net/api-docs/');
};

export const getQuiz = async (req, res) => {
    const { interests, numberOfQuestions } = req.query;
    const questions = await generateQuizQuestions(interests, numberOfQuestions);
    res.json({ questions });
};

export const getFormulaOneQuiz = async (req, res) => {
    const questions = await generateQuizQuestions('formula-one', 4);
    res.json({ questions });
};

export const getAnimeQuiz = async (req, res) => {
    const questions = await generateQuizQuestions('anime', 4);
    res.json({ questions });
};

export const getJSQuiz = async (req, res) => {
    const questions = await generateQuizQuestions('javascript', 4);
    res.json({ questions });
};

export const getGamingQuiz = async (req, res) => {
    const questions = await generateQuizQuestions('gaming', 4);
    res.json({ questions });
};

export const getCSSQuiz = async (req, res) => {
    const questions = await generateQuizQuestions('css', 4);
    res.json({ questions });
};

export const getAgileQuiz = async (req, res) => {
    const questions = await generateQuizQuestions('agile-management', 4);
    res.json({ questions });
};