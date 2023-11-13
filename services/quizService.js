import dotenv from 'dotenv';
import OpenAI from "openai";
import {generateUniqueSeed} from "./seedService.js";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const gpt_model = 'gpt-3.5-turbo-1106';
export const generateQuizQuestions = async (interests, numberOfQuestions) => {
    const generatedSeed = await generateUniqueSeed();
    const prompt = `Generate a quiz JSON object based on the interests: ${interests}. Create ${numberOfQuestions} questions. 
    The JSON object should be structured as follows:
    
      {
        "quizTitle": "Contextual and Unique Quiz Title Here",
        "questions": [
          {
            "questionTitle": "Unique and Contextual Question Title Here",
            "text": "The actual question here?",
            "options": [
              "a) Option 1",
              "b) Option 2",
              "c) Option 3",
              "d) Option 4"
            ],
            "correctAnswer": "a) Option 1"
          }
          // More questions here...
        ]
      }
    
    Once the quizTitle is set, it should not change. Each question should have a unique questionTitle. 
    The questions should have exactly four options labeled a), b), c), and d). 
    The Contextual questionTitle is not allowed to contain 'Question Number' or 'Interest Question Number', 
    think of something very special for each individual question.`;

    const openai = new OpenAI(OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
        model: gpt_model,
        response_format: { type: 'json_object'},
        messages: [{
            'role': 'system',
            'content': prompt
        }, {
            'role': 'user',
            'content': `${interests}, ${numberOfQuestions} questions`
        }],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        seed: generatedSeed
    });
    const rawContent = response.choices[0].message.content;
    const { usage } = response;
    const { system_fingerprint } = response;
    // console.log('rawContent:', JSON.stringify(rawContent, null, 2));

    const questionStrings = rawContent.split('\n\n');
    // console.log('questionStrings:', questionStrings);

    const questions = questionStrings.map(qs => {
        try {
            return JSON.parse(qs.trim());
        } catch (err) {
            console.error('Error parsing question:', err);
            return null;
        }
    }).filter(q => q);

    // Removing duplicates by using a Map object
    const uniqueQuestionsMap = new Map();
    questions.forEach(question => {
        uniqueQuestionsMap.set(question.text, question);
    });

    const finalResponse = {
        rawQuestions: Array.from(uniqueQuestionsMap.values()),
        usageData: usage,
        system_fingerprint: system_fingerprint,
        quiz_seed: generatedSeed,
        model: gpt_model,
    }
    console.log(finalResponse);
    // Converting the Map back to an array of unique questions
    return finalResponse;
};
