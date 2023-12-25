import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const create = async (req, res) => {
    const { title, goal } = req.body;
    const { id: authorId, name } = req.user;
    try {
        const activity = await prisma.activity.create({
            data: {
                title,
                goal,
                authorId,
            },
        });
        res.json({
            success: true,
            data: {
                title: activity.title,
                goal: activity.goal,
                author: name,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create activity'
        });
    }
};

const get = async (req, res) => {
    try {
        const { id: authorId } = req.user;
        const activities = await prisma.activity.findMany({
            where: {
                authorId,
            },
            select: {
                id: true,
                title: true,
                goal: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve activities'
        });
    }
};


const getId = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: authorId } = req.user;
        const activity = await prisma.activity.findUnique({
            where: {
                id: parseInt(id),
                authorId,
            },
            select: {
                id: true,
                title: true,
                goal: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: activity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve activity'
        });
    }
};


const update = async (req, res) => {
    const { id } = req.params;
    const { title, goal } = req.body;
    try {
        const activity = await prisma.activity.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                goal,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Updated data successfully',
            data: activity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update activity'
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await prisma.activity.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            message: 'Deleted data successfully',
            data: activity,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete activity'
        });
    }
};

export default { create, get, getId, update, remove };
