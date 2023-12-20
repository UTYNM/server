import { PrismaClient } from '@prisma/client';
import { format, parse } from 'date-fns';


const prisma = new PrismaClient();

const create = async (req, res) => {

    const { task, deadline, priority } = req.body;
    const { id: authorId, name } = req.user;
    try {
        const timeManagement = await prisma.timeManagement.create({
            data: {
                task,
                deadline: parse(deadline, 'dd-MM-yyyy', new Date()),
                priority,
                authorId,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                task: timeManagement.task,
                deadline: format(timeManagement.deadline, 'dd-MM-yyyy'),
                priority: timeManagement.priority,
                author: name,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create time management'
        });
    }
};

const get = async (req, res) => {
    try {
        const timeManagement = await prisma.timeManagement.findMany({
            select: {
                id: true,
                task: true,
                deadline: true,
                priority: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: timeManagement,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve time managements'
        });
    }
};

const getId = async (req, res) => {
    const { id } = req.params;
    try {

        const timeManagement = await prisma.timeManagement.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                task: true,
                deadline: true,
                priority: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!timeManagement) {
            return res.status(404).json({
                error: 'Time not found'
            });
        }
        res.status(200).json({
            success: true,
            data: timeManagement
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get time management'
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { task, deadline, priority } = req.body;
    try {
        const timeManagement = await prisma.timeManagement.update({
            where: {
                id: parseInt(id),
            },
            data: {
                task,
                deadline: parse(deadline, 'dd-MM-yyyy', new Date()),
                priority,
            },
        });
        res.status(200).json({
            success: true,
            mesagge: 'Update data successfully',
            data: timeManagement,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update time management'
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const timeManagement = await prisma.timeManagement.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({
            success: true,
            mesagge: 'Delete data successfully',
            data: timeManagement,
        })
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete time management'
        });
    }
};

// const scheduleReminder = async (timeManagement) => {
//     const daysUntilDeadline = differenceInDays(timeManagement.deadline, new Date());

//     // Check if the deadline is within a certain number of days (e.g., 1 day) and send a reminder
//     if (daysUntilDeadline === 1) {
//         sendReminderEmail(timeManagement);
//     }
// };

// const scheduleReminder = async (timeManagement) => {
//     const transporter = nodemailer.createTransport({
//         // Configure your email service
//         service: 'gmail',
//         auth: {
//             user: 'anumuti021@gmail.com',
//             pass: 'anum12345',
//         },
//     });

//     const mailOptions = {
//         from: 'anumuti021@gmail.com',
//         to: 'utianum021@example.com',
//         subject: `Reminder: Deadline for Task - ${timeManagement.task}`,
//         text: `Hello,\n\nThis is a reminder that the deadline for the task "${timeManagement.task}" is tomorrow (${format(timeManagement.deadline, 'dd-MM-yyyy')}).\n\nBest regards,\nYour App`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending reminder email:', error);
//         } else {
//             console.log('Reminder email sent:', info.response);
//         }
//     });
// };

// Buat transporter untuk mengirim email
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'anumuti021@gmail.com', // Ganti dengan alamat email Gmail Anda
//         pass: 'ilwm hjch chpz qlkk' // Ganti dengan kata sandi email Gmail Anda
//     }
// });

// // Konfigurasi email yang akan dikirim
// const mailOptions = {
//     from: 'anumuti021@gmail.com', // Ganti dengan alamat email Anda
//     to: 'utianum021@gmail.com', // Ganti dengan alamat email penerima
//     subject: 'Subject of the email',
//     text: 'dari timecontroller'
// };

// // Kirim email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log('Email sent:', info.response);
//     }
// });

export default { create, get, getId, update, remove };
