import {check, oneOf} from "express-validator";
import { signup, signin, logout, getUserSession } from "../controllers/authController.js";

export default (app) => {
    app.post('/api/signup', [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    ], signup);
    app.post('/api/signin', [
        oneOf([
            [
                check('email').isEmail().withMessage('Invalid email format'),
                check('password').exists().withMessage('Password is required'),
            ],
            [
                check('provider').exists().withMessage('Provider is required for OAuth'),
            ]
        ]),

    ], signin);
    app.post('/api/logout', logout);
    app.get('/api/getUserSession', getUserSession);
};
