import {prisma} from "../config/prismaClient.js";
import {formatDate} from "../services/formatDate.js";

export const userHistory = async (req, res) => {
    const { user: { id: user_id } } = req.user;

    // Retrieve offset and limit from the query parameters, and provide default values if they are not provided
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10; // default limit to 10 if not specified

    try {
        const quizzes = await prisma.quizzes.findMany({
            where: { user_id },
            skip: offset, // skip a certain number of records
            take: limit, // take a certain number of records
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                quiz_title: true,
                created_at: true
            }
        });

        const formattedQuizzes = quizzes.map(quiz => ({
            ...quiz,
            created_at: formatDate(quiz.created_at)
        }));

        // Also return the total count of records for the frontend to calculate total pages
        const totalCount = await prisma.quizzes.count({ where: { user_id } });

        res.json({ quizzes: formattedQuizzes, totalCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const quizHistory = async (req, res) => {
    // console.log('req.params.id:', req.params.quizId);
    try {
        const quiz = await prisma.quizzes.findUnique({
            where: { id: req.params.quizId },
            include: {
                questions: {
                    include: {
                        user_responses: true
                    }
                }
            }
        });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const formattedQuiz = {
            quiz_title: quiz.quiz_title,
            total_time_taken: quiz.total_time_taken,
            correctAnswersCount: quiz.correct_answers_count,
            questions: quiz.questions.map(q => {
                return {
                    text: q.text,
                    correct_answer: q.correct_answer,
                    user_response: q.user_responses.map(ur => {
                        return {
                            userAnswer: ur.user_answer,
                            is_correct: ur.is_correct
                        };
                    })[0]
                };
            })
        };
        res.json(formattedQuiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
