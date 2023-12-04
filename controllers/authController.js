import {supabase} from "../config/db.js";

const handleErrors = (res, error, statusCode = 400) => {
    return res.status(statusCode).json({ error: error.message });
};

const userSession = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authorized' });

    try {
        const { data, error } = await supabase.auth.getSession();

        if(error) return handleErrors(res, error);

        res.json(data);
    } catch (error) {
        handleErrors(res, error,500);
    }
};

const signup = async (req, res) => {
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
        res.status(200).json({ userID: data.user.id, email: data.user.email });
    } catch (error) {
        // console.error(error);
        handleErrors(res, error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        const { session } = data;

        if(error) return handleErrors(res, error);

        res.cookie('token', session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,  // 1 hour
            sameSite: 'strict'
        });
        res.status(200).json({ userID: data.user.id, email: data.user.email });
    } catch (error) {
        handleErrors(res, error);
    }
};

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Could not log out');
        res.status(200).send('Logged out successfully');
    });
};

const oAuth = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) return handleErrors(res, error);
        return res.json({ url: data.url });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
};

const oAuthCallback = async (req, res) => {
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
            httpOnly: true,
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

export { userSession, signup, login, logout, oAuth, oAuthCallback };
