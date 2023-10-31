export const isFormatValid = (req, res) => {
    const rawQuizzes = req.body.rawQuestions || [];

    let isValid = true;
    let invalidReason = '';

    const validatedQuizzes = rawQuizzes.map(quiz => {
        if (!quiz.quizTitle || typeof quiz.quizTitle !== 'string') {
            isValid = false;
            invalidReason = 'Invalid quiz title';
        }

        const validatedQuestions = quiz.questions.map(q => {
            if (
                !q.questionTitle ||
                typeof q.questionTitle !== 'string' ||
                typeof q.text !== 'string' ||
                q.text.trim() === '' ||
                !Array.isArray(q.options) ||
                q.options.length === 0 ||
                !q.options.every((option) => typeof option === 'string' && option.trim() !== '') ||
                typeof q.correctAnswer !== 'string' ||
                q.correctAnswer.trim() === '' ||
                !q.options.includes(q.correctAnswer)
            ) {
                isValid = false;
                invalidReason = 'Invalid question format';
            }
            return q;
        });

        return {
            quizTitle: quiz.quizTitle,
            questions: validatedQuestions
        };
    });

    if (isValid) {
        res.json({ rawQuestions: validatedQuizzes });
    } else {
        res.status(400).send({ error: invalidReason });
    }
};
