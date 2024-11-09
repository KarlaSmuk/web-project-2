import express, { Request, Response } from 'express';
import path from 'path';
import { AppDataSource } from './db';
import { seedData } from './seed';
import bodyParser from 'body-parser';
import { User } from './entities/User.entity';
import bcrypt from "bcrypt";
import { body, validationResult } from 'express-validator';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const PORT = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;

//rendering views
app.get('/', (req: Request, res: Response) => {
    res.render('home');
});

app.get('/xss', (req: Request, res: Response) => {
    res.render('xss', { user: "", error: "" });
});

app.get('/sde', (req: Request, res: Response) => {
    res.render('sde', { message: "", error: "" });
});

//endpoint for creating user, showing Sensitive Data Exposure
app.post('/sign-up', async (req: Request, res: Response) => {
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

//endpoint for login, showing XSS
app.post('/login', [
    body('email').isEmail().withMessage('You must enter email.'),
    body('password').isAlphanumeric().withMessage('Password must contain letters and numbers only')
], async (req: Request, res: Response) => {
    const { vulnerability, email, password } = req.body;

    if (!vulnerability) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('xss', { user: "", error: "Failed validation." })
        }
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email: email });
    if (user && bcrypt.compareSync(password, user.password)) {
        return res.render('xss', { user: user.email, error: "" })
    }

    res.render('xss', { user: "", error: "Invalid credentials." })
});

AppDataSource.initialize()
    .then(async () => {

        seedData().catch((error) => {
            console.error('Error seeding data:', error);
        });
        const hostname = '0.0.0.0';
        if (externalUrl) {
            app.listen(PORT, hostname, () => {
                console.log(`Server locally running at http://${hostname}:${PORT}/ and from
                outside on ${externalUrl}`);
            });
        } else {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
    })
    .catch((error) => console.log(error));
