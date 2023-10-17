import { welcome, getQuiz, getJSQuiz, getAgileQuiz, getAnimeQuiz, getGamingQuiz, getFormulaOneQuiz, getCSSQuiz } from '../controllers/quizController.js';

export default (app) => {
    app.get('/', welcome);
    app.get('/api/quiz', getQuiz);
    app.get('/api/quiz/javascript', getJSQuiz);
    app.get('/api/quiz/agile', getAgileQuiz);
    app.get('/api/quiz/anime', getAnimeQuiz);
    app.get('/api/quiz/gaming', getGamingQuiz);
    app.get('/api/quiz/formula-one', getFormulaOneQuiz);
    app.get('/api/quiz/css', getCSSQuiz);
};
