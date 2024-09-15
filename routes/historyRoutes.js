import {isAuthenticated} from "../middlewares/isAuthenticated.js";
import {quizHistory, userHistory} from '../controllers/historyController.js';

export default (app) => {
    app.get('/quizzes', isAuthenticated, userHistory);
    app.get('/quizzes/:quizId', isAuthenticated, quizHistory);
};
