import { validationResult } from "express-validator";
import { supabase } from "../config/db.js";
import { prisma } from "../config/prismaClient.js";

export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    } else {
        const newUser = await prisma.user.create({
            data: {
                email,
                password
            },
        });
    }
    res.json({ data, error: null });
};

export const signin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ userID:data['user']['id'], email: data['user']['email'], sessionToken:data['session']['access_token']});
};

export const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if(error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logged out successful' });
};