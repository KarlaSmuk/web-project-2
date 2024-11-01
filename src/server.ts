import express from 'express';
import path from 'path';
import { AppDataSource } from './db';
import { seedData } from './seed';

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

        seedData().catch((error) => {
            console.error('Error seeding data:', error);
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log(error));
