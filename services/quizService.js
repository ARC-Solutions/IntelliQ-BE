import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const cleanString = (str) => {
    return str.replace(/\n\n/g, " ");
};

export const generateQuizQuestions = async (interests, numberOfQuestions) => {
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
    The questions should have exactly four options labeled a), b), c), and d).`;

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
    console.log('rawContent:', JSON.stringify(rawContent, null, 2));

    const questionStrings = rawContent.split('\n\n');
    console.log('questionStrings:', questionStrings);

    const questions = questionStrings.map(qs => {
        try {
            const question = JSON.parse(qs.trim());

            // Check for undefined values before cleaning
            if (question.quizTitle && question.questionTitle && question.text && question.options && question.correctAnswer) {
                question.quizTitle = cleanString(question.quizTitle);
                question.questionTitle = cleanString(question.questionTitle);
                question.text = cleanString(question.text);
                question.options = question.options.map(option => option ? cleanString(option) : option);
                question.correctAnswer = cleanString(question.correctAnswer);
            } else {
                console.warn('One or more fields are undefined:', question);
            }

            return question;
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

    // Converting the Map back to an array of unique questions
    const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

    return uniqueQuestions;
};
