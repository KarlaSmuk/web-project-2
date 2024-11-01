import express from 'express';
import path from 'path';

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/xss', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'xss.html'));
});

app.get('/sde', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sde.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});