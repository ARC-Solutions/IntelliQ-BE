import { supabase } from "../config/db.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.token;
    const { data, error } = await supabase.auth.api.getUser(token);

    if (error) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    req.user = data;
    next();
};