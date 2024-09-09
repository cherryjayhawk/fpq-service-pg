import 'dotenv/config';

export default function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key is missing' });
    }

    const storedApiKey = process.env.API_KEY;
    if (apiKey !== storedApiKey) {
        return res.status(403).json({ success: false, message: 'Invalid API key' });
    }

    next();
}
