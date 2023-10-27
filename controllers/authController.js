import { validationResult } from "express-validator";
import { supabase } from "../config/db.js";
import { prisma } from "../config/prismaClient.js";

const handleErrors = (res, error, statusCode = 400) => {
    return res.status(statusCode).json({ error: error.message });
};

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        const { session } = data;

        if (error) return handleErrors(res, error);

        if (!session) {
            return res.status(400).json({ error: 'Session is undefined' });
        }

        res.cookie('token', session.access_token, {
            httpOnly: true,
            secure: 'production',
            maxAge: 3600000,  // 1 hour
            sameSite: 'strict'
        });
        // res.json(session);
        res.status(200).json('Signed up successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    const { session } = data;

    if(error) return handleErrors(res, error);

    res.cookie('token', session.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,  // 1 hour
        sameSite: 'strict'
    });
    res.status(200).send('Logged in successfully');
};

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Could not log out');
        res.status(200).send('Logged out successfully');
    });
};

export const oAuth = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) return handleErrors(res, error);
        return res.json({ url: data.url });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
};

export const oAuthCallback = async (req, res) => {
    try {
        // Exchange the code for a token
        const { code } = req.query;
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            code,
        });

        if (error) {
            console.error('Error:', error);
            return res.status(500).send(error.message);
        }

        // Set the token in a cookie
        const { session } = data;
        res.cookie('token', session.access_token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,  // 1 hour
            sameSite: 'strict'
        });

        // Redirect to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
};
