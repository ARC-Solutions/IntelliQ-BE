import { welcome, getQuiz, getJSQuiz, getAgileQuiz, getAnimeQuiz, getGamingQuiz, getFormulaOneQuiz, getCSSQuiz } from '../controllers/quizController.js';
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isFormatValid } from "../middlewares/isFormatValid.js";

export default (app) => {
    app.get('/', welcome);
    app.get('/api/quiz', isAuthenticated, getQuiz);
    app.get('/api/quiz/javascript', isAuthenticated, getJSQuiz);
    app.get('/api/quiz/agile', isAuthenticated, getAgileQuiz);
    app.get('/api/quiz/anime', isAuthenticated, getAnimeQuiz);
    app.get('/api/quiz/gaming', isAuthenticated, getGamingQuiz);
    app.get('/api/quiz/formula-one', isAuthenticated, getFormulaOneQuiz);
    app.get('/api/quiz/css', isAuthenticated, getCSSQuiz);
    app.get('/test', (req, res) => {
        res.json({ message: 'Server Working' });
    });
};
