import { validationResult } from "express-validator";
import { supabase } from "../config/db.js";

export const signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ user, error });
};

export const signin = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signIn({
        email,
        password
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ user, token: session.access_token });
};

export const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if(error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logged out successful' });
};