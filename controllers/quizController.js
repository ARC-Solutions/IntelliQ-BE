import { generateQuizQuestions } from "../services/quizService.js";
import { prisma } from "../config/prismaClient.js";

export const welcome =  async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API! For Documentation please visit: intelliq-be.azurewebsites.net/api-docs/');
};

export const getQuiz = async (req, res) => {
    const { interests, numberOfQuestions } = req.body;
    const userPayload = req.user;

    if (!userPayload || !userPayload.user || !userPayload.user.email) {
        return res.status(403).json({ error: 'Must be signed in' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: userPayload.user.email }
        });
        if (!user || !user.id) {
            return res.status(404).json({ error: 'User not found' });
        }
        const rawQuestions = await generateQuizQuestions(interests, numberOfQuestions);
        const validQuestions = rawQuestions.filter(q =>
            q.text && Array.isArray(q.options) && q.options.length > 0 && q.correctAnswer
        );
        if (validQuestions.length === 0) {
            return res.status(400).json({ error: 'No valid questions received' });
        }
        const newQuiz = await prisma.quiz.create({
            data: {
                createdBy: { connect: { id: user.id } },
                topic: interests,
                questions: {
                    create: validQuestions.map(q => ({
                        text: q.text,
                        options: q.options,  // No .join(",") here if Prisma expects an array
                        correctAnswer: q.correctAnswer
                    }))
                }
            },
        });
        const quizHistory = await prisma.quizHistory.create({
            data: {
                user: { connect: { id: user.id } },
                quiz: { connect: { id: newQuiz.id } },
                score: 0,
            },
        });

        res.json({ rawQuestions, newQuiz, quizHistory });
    } catch (error) {
        console.error("Error in getQuiz:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
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