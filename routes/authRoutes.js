import { check } from "express-validator";
import {signup, login, logout, oAuth, oAuthCallback, userSession} from "../controllers/authController.js";

export default (app) => {
    app.post('/api/login', [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    ], login);
    app.post('/api/signup', [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    ], signup);
    app.post('/api/logout', logout);
    app.get('/api/auth/google', oAuth);
    app.get('/api/auth/google/callback', oAuthCallback);
    app.get('/api/auth/userSession', userSession)
};
