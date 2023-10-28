import { test } from 'vitest';
import { generateQuizQuestions } from '../services/quizService.js';
import { isFormatValid } from '../middlewares/isFormatValid.js';

test('generateQuizQuestions generates valid questions multiple times', async () => {
    const totalRuns = 3;
    let validCount = 0;

    for (let i = 0; i < totalRuns; i++) {

        const questions = await generateQuizQuestions('formula-one', 4);

        for (const question of questions) {
            // Mock request and response objects
            const req = { rawQuestions: [question] };
            const res = {
                json: () => {},
                status: () => ({ send: () => {} }),
            };

            let nextCalled = false;
            const next = () => {
                nextCalled = true;
            };

            // Invoke the middleware to check the format
            isFormatValid(req, res, next);

            // If next() was called, the format is valid
            if (nextCalled) {
                validCount++;
            }
        }
    }
}, 60000);
