import {prisma} from "../config/prismaClient.js";

export const userHistory = async (req, res) => {
    const { user: { id: user_id } } = req.user;

    try {
        const quizzes = await prisma.quizzes.findMany({
            where: { user_id },
            select: {
                id: true,
                quiz_title: true,
                total_time_taken: true
            }
        });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};