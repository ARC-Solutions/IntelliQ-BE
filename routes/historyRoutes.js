import {isAuthenticated} from "../middlewares/isAuthenticated.js";
import {
    userHistory
} from '../controllers/historyController.js';

export default (app) => {
    app.get('/quizzes', isAuthenticated, userHistory);
};