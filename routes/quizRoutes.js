import { welcome, getQuiz, getJSQuiz, getAgileQuiz, getAnimeQuiz, getGamingQuiz, getFormulaOneQuiz, getCSSQuiz } from '../controllers/quizController.js';
import {isAuthenticated} from "../middlewares/isAuthenticated.js";

export default (app) => {
    app.get('/', welcome);
    app.post('/api/quiz', isAuthenticated, getQuiz);
    app.get('/api/quiz/javascript', getJSQuiz);
    app.get('/api/quiz/agile', getAgileQuiz);
    app.get('/api/quiz/anime', getAnimeQuiz);
    app.get('/api/quiz/gaming', getGamingQuiz);
    app.get('/api/quiz/formula-one', getFormulaOneQuiz);
    app.get('/api/quiz/css', getCSSQuiz);
    app.get('/test', (req, res) => {
        res.send('Server is working');
    });
};
