import { welcome, getQuiz, getJSQuiz, getAgileQuiz, getAnimeQuiz, getGamingQuiz, getFormulaOneQuiz, getCSSQuiz } from '../controllers/quizController.js';
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isFormatValid } from "../middlewares/isFormatValid.js";

export default (app) => {
    app.get('/', welcome);
    app.post('/api/quiz', isAuthenticated, getQuiz);
    app.get('/api/quiz/javascript', isAuthenticated, getJSQuiz, isFormatValid);
    app.get('/api/quiz/agile', isAuthenticated, getAgileQuiz, isFormatValid);
    app.get('/api/quiz/anime', isAuthenticated, getAnimeQuiz, isFormatValid);
    app.get('/api/quiz/gaming', isAuthenticated, getGamingQuiz, isFormatValid);
    app.get('/api/quiz/formula-one', isAuthenticated, getFormulaOneQuiz, isFormatValid);
    app.get('/api/quiz/css', isAuthenticated, getCSSQuiz, isFormatValid);
};
