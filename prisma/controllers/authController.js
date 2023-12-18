import bcrypt from 'bcrypt';
import { format, parse } from 'date-fns';
import { generateToken } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { name, email, password, gender, birthdate } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: 'name, email and password are required',
        });
        return;
    }
    const existEmail = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existEmail) {
        res.status(400).json({
            success: false,
            message: 'email already exist',
        });
        return;
    }
    try {
        const hash = await bcrypt.hash(password, 10);

        const parsedBirthdate = parse(birthdate, 'dd-MM-yyyy', new Date());

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hash,
                gender,
                birthdate: parsedBirthdate,
            },
        });

        const formattedBirthdate = format(parsedBirthdate, 'dd-MM-yyyy');
        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                gender: user.gender,
                birthdate: formattedBirthdate,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'email and password are required',
        });
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Email or password is incorrect',
        });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({
            success: false,
            message: 'Email or password is incorrect',
        });
        return;
    }

    const token = generateToken(user);
    res.status(200).json({
        success: true,
        data: {
            user: {
                name: user.name,
                email: user.email,
                gender: user.gender,
                birthdate: user.birthdate,
            },

            token,
            expiresIn: '3600',
        },
    });
};

export default { register, login };
