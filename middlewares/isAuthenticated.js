import { supabase } from "../config/db.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'Not authorized' });

    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) return res.status(401).json({ error: 'Not authorized' });
    req.user = user;

    next();
};
