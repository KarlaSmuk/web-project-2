import express from 'express';
import path from 'path';
import { AppDataSource } from './db';
import { seedData } from './seed';
import bodyParser from 'body-parser';
import { User } from './entities/User.entity';
import bcrypt from "bcrypt";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;

//rendering views
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/xss', (req, res) => {
    res.render('xss');
});

app.get('/sde', (req, res) => {
    res.render('sde', { message: "", error: "" });
});

//endpoint for creating user, showing Sensitive Data Exposure
app.post('/sign-up', async (req, res) => {
    const { vulnerability, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = {
        email: email,
        password: vulnerability ? password : await bcrypt.hash(password, 10)
    }

    try {
        await userRepository.save(user);

        res.render('sde', { message: "User created", error: "" });
    } catch (error) {
        res.render('sde', { message: "", error: "User not created." });
    }
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
