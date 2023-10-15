import { createClient } from '@supabase/supabase-js';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const OpenAI = require('openai');
const { check, validationResult } = require('express-validator');

const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_ANON_KEY);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const app = express();

const configureMiddlewares = () => {
    app.use(express.json());
    app.use(cors());
};

const configureSwagger = () => {
    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: 'IntelliQ-BE API',
                version: '2.0.0',
                description: 'API for IntelliQ-BE',
            },
        },
        apis: ['server.js'],
    };
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

const generateQuizQuestions = async (interests, numberOfQuestions) => {
    const prompt = `Generate ${numberOfQuestions} multiple-choice quiz questions based on the user's interests in 
    ${interests}. Each question should come with four answer options labeled a, b, c, and d. Include the correct answer 
    for each question, beginning the line with 'Answer:'. The correct answer should be formatted exactly like its corresponding option.`;
    const openai = new OpenAI(OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            'role': 'system',
            'content': prompt
        }, {
            'role': 'user',
            'content': `${interests}, ${numberOfQuestions} questions`
        }],
        temperature: 1,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const rawContent = response.choices[0].message.content;
    const rawQuestions = rawContent.split('\n\n');
    return rawQuestions.map((q) => {
        const parts = q.split('\n');
        const questionText = parts[0];
        const options = parts.slice(1, -1);
        const correctOptionKey = parts[parts.length - 1].split(' ')[1];
        const correctAnswer = options.find(opt => opt.startsWith(correctOptionKey));
        return {
            text: questionText,
            options: options,
            correctAnswer: correctAnswer
        };
    });
};

app.get('/api/welcome', async (req, res) => {
    res.send('Welcome to the IntelliQ-BE API!');
});

app.get('/api/quiz', async (req, res) => {
    const { interests, numberOfQuestions } = req.query;
    const questions = await generateQuizQuestions(interests, numberOfQuestions);
    res.json({ questions });
});

app.get('/api/quiz/formula-one', async (req, res) => {
    const questions = await generateQuizQuestions('formula-one', 4);
    res.json({ questions });
});

app.get('/api/quiz/anime', async (req, res) => {
    const questions = await generateQuizQuestions('anime', 4);
    res.json({ questions });
});

app.get('/api/quiz/js', async (req, res) => {
    const questions = await generateQuizQuestions('javascript', 4);
    res.json({ questions });
});


app.get('/api/quiz/gaming', async (req, res) => {
    const questions = await generateQuizQuestions('gaming', 4);
    res.json({ questions });
});

app.get('/api/quiz/css', async (req, res) => {
    const questions = await generateQuizQuestions('css', 4);
    res.json({ questions });
});

app.get('/api/quiz/agile', async (req, res) => {
    const questions = await generateQuizQuestions('agile-management', 4);
    res.json({ questions });
});

app.post('/api/signup', [
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
],async (req, res) => {
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
});

app.post('/api/signin', [
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').exists().withMessage('Password is required'),
], async (req, res) => {
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

    res.json({ user });
});

const isAuthenticated = async (req, res, next) => {
    const token = req.headers.token;

    const { data, error } = await supabase.auth.api.getUser(token);

    if (error) {
        return res.status(401).json({ error: error.message });
    }

    req.user = data;
    next();
};

app.use((err, req, res, next) => {
    console.error(err.stack);

    const message = err.message || 'Internal Server Error';

    res.status(err.status || 500).json({ error: message });
});

const startServer = async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

configureMiddlewares();
configureSwagger();
startServer().catch(e => console.error(e));
