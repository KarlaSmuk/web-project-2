import { AppDataSource } from "./db";
import { User } from "./entities/User.entity";
import bcrypt from "bcrypt";

export const seedData = async () => {

    const userRepository = AppDataSource.getRepository(User);

    const users = [
        {
            email: 'user1@example.com',
            password: 'password1',
        },
        {
            email: 'user2@example.com',
            password: 'password2',
        },
    ];

    for (const user of users) {
        const existingUser = await userRepository.findOne({ where: { email: user.email } });
        if (!existingUser) {
            user.password = await bcrypt.hash(user.password, 10);

            await userRepository.save(user);
        }
    }

    console.log('Seed data has been inserted.');
};
