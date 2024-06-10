import {prisma} from "../config/prismaClient.js";
import {formatDate} from "../services/formatDate.js";

const userHistory = async (req, res) => {
    const {user: {id: user_id}} = req.user;

    // Retrieve offset and limit from the query parameters, and provide default values if they are not provided
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10; // default limit to 10 if not specified

    try {
        const quizzes = await prisma.quizzes.findMany({
            where: {user_id},
            skip: offset, // skip a certain number of records
            take: limit, // take a certain number of records
            orderBy: {created_at: 'desc'},
            select: {
                id: true,
                quiz_title: true,
                created_at: true,
            }
        });

        const formattedQuizzes = quizzes.map(quiz => ({
            ...quiz,
            created_at: formatDate(quiz.created_at)
        }));

        const allQuizzes = await prisma.quizzes.findMany({
            where: {user_id},
            select: {
                topics: true // Include topics in the selection
            }
        });

        // Fisher-Yates (Knuth) shuffle algorithm
        const shuffleArray = (array) => {
            for(let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // extract topics and flatten the array
        const topics = allQuizzes.flatMap(quiz => quiz.topics.map(topic => topic.toLowerCase()));

        // count the occurrence of each topic
        const topicCounts = topics.reduce((counts, topic) => {
            counts[topic] = (counts[topic] || 0) + 1;
            return counts;
        }, {});

        // sort the topics by their occurrence count in descending order
        const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

        // Log the top five topics along with their occurrence count
        // const topFiveTopicsWithCount = sortedTopics.slice(0, 5).map(topic => `${topic[0]} x${topic[1]}`);
        // console.log(topFiveTopicsWithCount); // Log the top five topics

        // return the top five topics without their occurrence count
        const topFiveTopics = sortedTopics.slice(0, 5).map(topic => ({
            name: topic[0].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
            topic_frequency: topic[1]
        }));

        const totalCount = await prisma.quizzes.count({where: {user_id}});
        shuffleArray(topFiveTopics)
        console.log(topFiveTopics);

        res.json({quizzes: formattedQuizzes, totalCount, topFiveTopics});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const quizHistory = async (req, res) => {
    // console.log('req.params.id:', req.params.quizId);
    const {user: {id: user_id}} = req.user;
    try {
        const quiz = await prisma.quizzes.findUnique({
            where: {id: req.params.quizId, user_id},
            include: {
                questions: {
                    include: {
                        user_responses: true
                    }
                }
            }
        });
        if (!quiz) {
            return res.status(404).json({
                message: 'You are trying to access other users data',
                error: 'Quiz not found'
            });
        }

        const formattedQuiz = {
            quiz_id: quiz.id,
            rawQuestions: {
                timeTaken: quiz.total_time_taken,
                quiz_title: quiz.quiz_title,
                correctAnswersCount: quiz.correct_answers_count,
                questions: quiz.questions.map(q => {
                    return {
                        text: q.text,
                        correctAnswer: q.correct_answer,
                        userAnswer: q.user_responses[0].user_answer,
                    };
                })
            }
        };
        res.json(formattedQuiz);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const deleteHistory = async (req, res) => {
    const {user: {id: user_id}} = req.user;
    try {
        const quiz = await prisma.quizzes.delete({
            where: {id: req.params.quizId, user_id}
        });
        if (!quiz) {
            return res.status(404).json({error: 'Quiz not found'});
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({message: 'You are trying to access other users data', error: error.message})
    }
};

export {userHistory, quizHistory, deleteHistory};
