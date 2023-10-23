import { welcome, getQuiz, getJSQuiz, getAgileQuiz, getAnimeQuiz, getGamingQuiz, getFormulaOneQuiz, getCSSQuiz } from '../controllers/quizController.js';
import {isAuthenticated} from "../middlewares/isAuthenticated.js";

export default (app) => {
    app.get('/', welcome);
    app.post('/api/quiz', isAuthenticated, getQuiz);
    app.get('/api/quiz/javascript', isAuthenticated, getJSQuiz);
    app.get('/api/quiz/agile', isAuthenticated, getAgileQuiz);
    app.get('/api/quiz/anime', isAuthenticated, getAnimeQuiz);
    app.get('/api/quiz/gaming', isAuthenticated, getGamingQuiz);
    app.get('/api/quiz/formula-one', isAuthenticated, getFormulaOneQuiz);
    app.get('/api/quiz/css', isAuthenticated, getCSSQuiz);
};
