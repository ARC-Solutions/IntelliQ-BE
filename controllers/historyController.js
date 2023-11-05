import {prisma} from "../config/prismaClient.js";

export const userHistory = async (req, res) => {
    const { user: { id: user_id } } = req.user;

    // Retrieve offset and limit from the query parameters, and provide default values if they are not provided
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 20; // default limit to 10 if not specified

    try {
        const quizzes = await prisma.quizzes.findMany({
            where: { user_id },
            skip: offset, // skip a certain number of records
            take: limit, // take a certain number of records
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                quiz_title: true,
                total_time_taken: true
            }
        });

        // Also return the total count of records for the frontend to calculate total pages
        const totalCount = await prisma.quizzes.count({ where: { user_id } });

        res.json({ quizzes, totalCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const quizHistory = async (req, res) => {
    console.log('req.params.id:', req.params.quizId);
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
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
