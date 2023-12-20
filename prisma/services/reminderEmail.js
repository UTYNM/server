import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { format } from 'date-fns';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendReminderEmail = async (task, email) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Reminder: Deadline for Task - ${task}`,
        text: `Dear User,\n\nThis is a reminder for the upcoming deadline of your task: ${task}. Please complete it on time.\n\nBest regards,\nYour App Name`,
    };

    await transporter.sendMail(mailOptions);
};

const scheduleReminders = () => {
    // Memulai schedule untuk setiap jam 00:00 atau mengirim setiap jam 00:00
    cron.schedule('0 0 * * *', async () => {
        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);  // mengambil tanggal besok

            const timeManagements = await prisma.timeManagement.findMany({
                where: {
                    deadline: {
                        gte: today,
                        lt: tomorrow, // mengambil deadline satu hari ke depan
                    },
                },
                include: {
                    author: {
                        select: {
                            email: true,
                        },
                    },
                },
            });

            timeManagements.forEach((timeManagement) => {
                const { task, deadline, author } = timeManagement;
                const { email } = author;

                // Periksa apakah tenggat waktunya dalam 24 jam ke depan jika ya email akan dikirimkan 
                const timeDifference = deadline.getTime() - today.getTime();
                const hoursDifference = timeDifference / (1000 * 3600);

                if (hoursDifference <= 24) {
                    const formattedDeadline = format(deadline, 'dd-MM-yyyy');
                    console.log(`Sending reminder for task: ${task}, Deadline: ${formattedDeadline}, Email: ${email}`);
                }

                sendReminderEmail(task, email);
            });
        } catch (error) {
            console.error('Error scheduling reminders:', error);
        }
    });
};

export { scheduleReminders };
