import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const generateQuizQuestions = async (interests, numberOfQuestions) => {
    const prompt = `Generate ${numberOfQuestions} multiple-choice quiz questions based on the user's interests in 
    ${interests}. Each question should come with four answer options labeled a), b), c), and d). Include the correct answer 
    for each question, beginning the line with 'Answer:'. The correct answer should be formatted exactly like its corresponding option.
    Your questions are not allowed to have more than 4 options under any circumstances. 
    make sure that your response is always formated like:
    {
    "raw": "1) QUESTION?\\na) ANSWER 1 \\nb) ANSWER 2 \\nc) ANSWER 3 \\nd) ANSWER 4\\nAnswer: b) ANSWER 2\\n\\n"
    }
    no matter the number of questions`;
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