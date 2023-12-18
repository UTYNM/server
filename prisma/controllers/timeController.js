// Import the Prisma client
import { PrismaClient } from '@prisma/client';
import { format, parse } from 'date-fns';

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Create a new time
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

// Get all times
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

// Get a single time by ID
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

// Update a time by ID
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

// Delete a time by ID
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
