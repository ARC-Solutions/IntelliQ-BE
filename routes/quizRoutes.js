import {
    welcome,
    getQuiz,
    getQuizVideo,
    saveQuizResults, getBlanksQuiz
} from '../controllers/quizController.js';
import {isAuthenticated} from "../middlewares/isAuthenticated.js";

export default (app) => {
    app.get('/', welcome);
    app.get('/api/quiz', isAuthenticated, getQuiz);
    app.get('/api/video-quiz', isAuthenticated, getQuizVideo);
    app.get('/api/blank-quiz', isAuthenticated, getBlanksQuiz);
    app.post('/api/submit-quiz', isAuthenticated, saveQuizResults);
};
