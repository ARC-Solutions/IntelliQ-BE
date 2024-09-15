import {getQuiz, saveQuizResults, welcome} from '../controllers/quizController.js';
import {isAuthenticated} from "../middlewares/isAuthenticated.js";

export default (app) => {
    app.get('/', welcome);
    app.get('/api/quiz', isAuthenticated, getQuiz);
    app.post('/api/submit-quiz', isAuthenticated, saveQuizResults);
};
