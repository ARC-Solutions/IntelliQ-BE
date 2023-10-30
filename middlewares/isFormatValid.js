export const isFormatValid = (req, res, next) => {
    const rawQuestions = req.rawQuestions || [];

    let isValid = true;
    let invalidReason = '';

    for (const q of rawQuestions) {
        if (
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
            break;
        }
    }

    if (isValid) {
        res.json({ rawQuestions });
    } else {
        res.status(400).send({ error: invalidReason });
    }
};