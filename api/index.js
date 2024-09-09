import express from 'express';
import bodyParser from 'body-parser';
// import multer from 'multer';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import invoicesRoutes from "../routes/invoices.js";
import authToken from '../lib/auth.js'
import randomize from "randomatic"
import { getAllUsers, insertUser, getUser } from '../lib/query.js';
import { limiter } from '../lib/rateLimit.js';
import checkApiKey from '../lib/apiKey.js';
import { injector } from '../lib/injector.js';

const app = express();

app.use(bodyParser.json());
app.use(checkApiKey);
app.use(limiter);
app.set('trust proxy', true);
app.use('/invoices', invoicesRoutes);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = file.originalname.split('.').pop();
//         cb(null, Date.now() + randomize('Aa0', 4) + '.' + fileExtension);
//     },
// });

// const upload = multer({ storage });

// app.use('/uploads', express.static('uploads'));

// app.post('/upload', authToken, upload.single('file'), async (req, res) => {
//     console.log("uploading...")
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }
//         console.log("upload completed")
//         return res.status(200).json({ success: true, message: 'File uploaded and compressed successfully', filename: req.file.filename });
//     } catch (error) {
//         console.error('Error processing uploaded file:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        if (injector(email)) return res.status(403).json({ success: false, message: 'Email atau password salah' })
        
        const user = await getUser(email)

        if (user === undefined) return res.status(401).json({ success: false, message: 'User tidak ditemukan' })

        if (await bcrypt.compare(req.body.password, user.rows[0].password)) {
            const accessToken = jwt.sign({ email: user.rows[0].email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
            return res.status(200).json({ success: true, message: 'Berhasil login', accessToken: accessToken, user: { email: user.rows[0].email } })
        } else {
            return res.status(401).json({ success: false, message: 'Email atau password salah' })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body
        if (injector(email) || injector(password)) return res.status(403).json({ success: false }) 
        const users = await getAllUsers()

        if (users.rowCount > 0) return res.status(403).json({ success: false, message: 'Not allowed' })
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const register = await insertUser(email, hashedPassword)

        if (register === undefined) return res.status(500).json({ success: false })

        return res.status(201).json({ success: true, message: 'user registered!' })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

export default app