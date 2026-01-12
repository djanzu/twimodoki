const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database');
const htmlGenerator = require('./htmlGenerator');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Simple sanitization or just timestamp
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 4 }
});

// Routes
app.get('/', (req, res) => {
    res.redirect('/post.html');
});

app.get('/timeline', (req, res) => {
    res.redirect('/index.html');
});

// API Post
app.post('/api/posts', upload.array('images', 4), async (req, res) => {
    try {
        const content = req.body.content;
        const files = req.files || [];
        const images = files.map(f => f.filename);

        await db.run('INSERT INTO posts (content, images) VALUES (?, ?)', [content, JSON.stringify(images)]);

        // Regenerate HTML
        const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC');
        await htmlGenerator.generateAll(posts);

        res.redirect('/index.html');
    } catch (e) {
        console.error(e);
        res.status(500).send('Error creating post');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
