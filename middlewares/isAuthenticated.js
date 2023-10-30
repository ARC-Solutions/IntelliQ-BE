import { supabase } from "../config/db.js";

export const isAuthenticated = async (req, res, next) => {
    // Read from Authorization header
    const headerToken = req.headers['authorization']?.split(' ')[1];

    // Read from cookies
    const cookieToken = req.cookies?.token;
    //console.log(cookieToken);

    // Use the first available token
    const token = headerToken || cookieToken;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    const { data: user, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    req.user = user;
    next();
};
