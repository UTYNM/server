import { PrismaClient } from '@prisma/client';
import { format, parse, parseISO } from 'date-fns';


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
        const { id: authorId } = req.user;
        const timeManagement = await prisma.timeManagement.findMany({
            where: {
                authorId,
            },
            select: {
                id: true,
                task: true,
                deadline: true,
                priority: true,
                createdAt: true,
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
    try {
        const { id } = req.params;
        const { id: authorId } = req.user;
        const timeManagement = await prisma.timeManagement.findUnique({
            where: {
                id: parseInt(id),
                authorId,
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
                deadline: parseISO(deadline),
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

export default { create, get, getId, update, remove };
