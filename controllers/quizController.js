import { generateQuizQuestions } from "../services/quizService.js";
import {prisma} from "../config/prismaClient.js";
import {supabase} from "../config/db.js";

export const welcome =  async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API! For Documentation please visit: intelliq-be.azurewebsites.net/api-docs/');
};

export const getQuiz = async (req, res) => {
    const { interests, numberOfQuestions } = req.query;
    const rawQuestions = await generateQuizQuestions(interests, numberOfQuestions);
    res.json({ rawQuestions });
};

export const saveQuizResults = async (req, res) => {
    // Read from Authorization header
    const headerToken = req.headers['authorization']?.split(' ')[1];

    // Read from cookies
    const cookieToken = req.cookies?.token;
    //console.log(cookieToken);

    // Use the first available token
    const token = headerToken || cookieToken;
    if (!token) {
        res.status(400).json({ error: 'No token provided.' });
        return;
    }

    try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (!user || !user.id) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const { rawQuestions } = req.body;
        const { quizTitle, questions, timeTaken } = rawQuestions;

        const createdQuiz = await prisma.quizzes.create({
            data: {
                user_id: user.id,
                quiz_title: quizTitle,
                total_time_taken: timeTaken,
                correct_answers_count: 0
            }
        });

        const correctAnswersCount = questions.reduce((count, question) =>
            count + (question.userAnswer === question.correctAnswer ? 1 : 0), 0);

        const transactionOperations = questions.map(question => async () => {
            const isCorrect = question.userAnswer === question.correctAnswer;
            const createdQuestion = await prisma.questions.create({
                data: {
                    text: question.text,
                    options: question.options,
                    correct_answer: question.correctAnswer,
                    quiz_id: createdQuiz.id
                }
            });

            return prisma.user_responses.create({
                data: {
                    question_id: createdQuestion.id,
                    quiz_id: createdQuiz.id,
                    user_answer: question.userAnswer,
                    is_correct: isCorrect
                }
            });
        });

        await Promise.all(transactionOperations.map(operation => operation()));

        await prisma.quizzes.update({
            where: { id: createdQuiz.id },
            data: { correct_answers_count: correctAnswersCount }
        });

        const formattedResponse = {
            quiz_id: createdQuiz.id,
            rawQuestions: {
                quiz_title: quizTitle,
                timeTaken,
                correctAnswersCount,
                questions: questions.map(question => ({
                    text: question.text,
                    correctAnswer: question.correctAnswer,
                    userAnswer: question.userAnswer
                })),
            },
        };

        res.status(201).json(formattedResponse);
    } catch (error) {
        console.error('Error saving quiz data:', error);
        res.status(500).json({ error: 'An error occurred while saving quiz data.' });
    }
};
