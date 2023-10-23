import { generateQuizQuestions } from "../services/quizService.js";
import { prisma } from "../config/prismaClient.js";

export const welcome =  async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API! For Documentation please visit: intelliq-be.azurewebsites.net/api-docs/');
};

export const getQuiz = async (req, res) => {
    const { interests, numberOfQuestions } = req.body;
    const token = req.headers.authorization;
    // console.log("token:", token)

    if (!token) {
        return res.status(403).json({ error: 'Must be signed in' });
    }

    // let { data: user, error } = await supabase.auth.getUser(token);

    // if (error) {
    //     return res.status(403).json({ error: 'Invalid token' });
    // }

    try {
        const userId = req.user.user.id;  // Extract userId from req.user
        const rawQuestions = await generateQuizQuestions(interests, numberOfQuestions);
        let isFormatValid = true;
        let invalidReason = '';

        for (const q of rawQuestions) {
            if (
                typeof q.text !== 'string' ||
                q.text.trim() === '' ||
                !Array.isArray(q.options) ||
                q.options.length === 0 ||
                !q.options.every((option) => typeof option === 'string' && option.trim() !== '') ||
                typeof q.correctAnswer !== 'string' ||
                q.correctAnswer.trim() === '' ||
                !q.options.includes(q.correctAnswer)
            ) {
                isFormatValid = false;
                invalidReason = 'Invalid question format';
                break;
            }
        }

        if (isFormatValid) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                console.error(`User with ID ${userId} does not exist`);
                return;
            }

            const newQuiz = await prisma.quiz.create({
                data: {
                    createdById: userId,
                    topic: interests,
                    createdAt: new Date(),
                }
            });

            if (!newQuiz) {
                return res.status(500).json({ error: 'Failed to create quiz' });
            }

            // Insert questions here
            const insertedQuestions = await prisma.question.createMany({
                data: rawQuestions.map(q => ({
                    quizId: newQuiz.id,
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer
                }))
            });

            if (!insertedQuestions) {
                return res.status(500).json({ error: 'Failed to create questions' });
            }

            const quizHistory = await prisma.quizHistory.create({
                data: {
                    userId: userId,
                    quizId: newQuiz.id,
                    attemptedAt: new Date(),
                    score: 0,
                }
            });

            if (!quizHistory) {
                return res.status(500).json({ error: 'Failed to record quiz history' });
            }

            res.json({ rawQuestions, newQuiz, quizHistory, insertedQuestions });
        } else {
            res.status(400).send({ error: invalidReason });
        }

    }
    catch (error) {
        console.error("Error in getQuiz:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFormulaOneQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('formula-one', 4);
    req.rawQuestions = questions;
    next();
};

export const getAnimeQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('anime', 4);
    req.rawQuestions = questions;
    next();
};

export const getJSQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('javascript', 4);
    req.rawQuestions = questions;
    next();
};

export const getGamingQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('gaming', 4);
    req.rawQuestions = questions;
    next();
};

export const getCSSQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('css', 4);
    req.rawQuestions = questions;
    next();
};

export const getAgileQuiz = async (req, res, next) => {
    const questions = await generateQuizQuestions('agile-management', 4);
    req.rawQuestions = questions;
    next();
};