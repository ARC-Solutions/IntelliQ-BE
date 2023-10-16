export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const message = err.message || 'Internal Server Error';

    res.status(err.status || 500).json({ error: message });
};