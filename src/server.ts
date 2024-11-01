import express from 'express';
import path from 'path';
import { AppDataSource } from './db';

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/xss', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'xss.html'));
});

app.get('/sde', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sde.html'));
});

AppDataSource.initialize()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log(error));
