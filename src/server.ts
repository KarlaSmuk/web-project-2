import express from 'express';
import path from 'path';

const app = express();
app.set("views", path.join(__dirname, "views"));

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});