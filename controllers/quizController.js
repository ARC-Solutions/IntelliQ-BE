import { generateQuizQuestions } from "../services/quizService.js";
import {prisma} from "../config/prismaClient.js";

export const welcome =  async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API! For Documentation please visit: intelliq-be.azurewebsites.net/api-docs/');
};

export const getQuiz = async (req, res) => {
    const { interests, numberOfQuestions } = req.query;
    const rawQuestions = await generateQuizQuestions(interests, numberOfQuestions);
    res.json({ rawQuestions });
};

export const saveQuizResults = async (req, res) => {
    const { userId, rawQuestions } = req.body;
    const { quizTitle, questions } = rawQuestions;

    try {
        // Check if quiz already exists for the user
        let createdQuiz = await prisma.quizzes.findUnique({
            where: {
                user_id: userId
            }
        });

        // If quiz does not exist, create a new one
        if (!createdQuiz) {
            createdQuiz = await prisma.quizzes.create({
                data: {
                    user_id: userId,
                    quiz_title: quizTitle
                }
            });
        }

        // Start transaction
        const createdQuestions = await prisma.$transaction(
            questions.map(question =>
                prisma.questions.create({
                    data: {
                        text: question.text,
                        options: question.options,
                        correct_answer: question.correctAnswer,
                        quiz_id: createdQuiz.id
                    }
                })
            )
        );

        // After creating questions, create responses with the new question IDs
        const createdResponses = await prisma.$transaction(
            createdQuestions.map((createdQuestion, index) => {
                const correspondingUserQuestion = questions[index];
                return prisma.user_responses.create({
                    data: {
                        question_id: createdQuestion.id,
                        quiz_id: createdQuiz.id,
                        user_answer: correspondingUserQuestion.userAnswer,
                        time_taken: correspondingUserQuestion.timeTaken,
                        is_correct: correspondingUserQuestion.userAnswer === correspondingUserQuestion.correctAnswer
                    }
                });
            })
        );

        res.status(201).json({ message: 'Quiz results saved successfully.', createdQuestions, createdResponses });
    } catch (error) {
        console.error('Error saving quiz data:', error);
        res.status(500).json({ error: 'An error occurred while saving quiz data.' });
    }
};
