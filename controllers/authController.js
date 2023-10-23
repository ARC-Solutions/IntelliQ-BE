import { validationResult } from "express-validator";
import { supabase } from "../config/db.js";
import { prisma } from "../config/prismaClient.js";

const handleErrors = (res, error, statusCode = 400) => {
    return res.status(statusCode).json({ error: error.message });
};

export const getUserSession = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return handleErrors(res, new Error('Not authorized, no token provided'), 401);

    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) return handleErrors(res, new Error('Not authorized, invalid token'), 401);

    const userId = user?.user?.identities?.[0]?.user_id ?? 'Unknown';
    const email = user?.user?.identities?.[0]?.identity_data?.email ?? 'Unknown';

    res.json({ user });
    // res.json({ userID: userId, email });
};

export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleErrors(res, new Error(errors.array().join(', ')));

    const { email, password } = req.body;

    // Check if user exists before signing up
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) return handleErrors(res, new Error('User already exists'));

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return handleErrors(res, error);


    res.json({ userID: data.user.id, email: data.user.email, sessionToken: data.session.access_token });
};

export const signin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleErrors(res, new Error(errors.array().join(', ')));

    const { email, password, provider } = req.body;

    let data, error;

    if (provider) {
        ({ data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' }));
        if (error) return handleErrors(res, error);
        return res.json({ url: data.url });
    }

    ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
    if (error) return handleErrors(res, error);

    res.json({ userID: data.user.id, email: data.user.email, sessionToken: data.session.access_token });
};

export const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if(error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logged out successful' });
};