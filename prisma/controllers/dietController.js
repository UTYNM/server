import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const create = async (req, res) => {
    const { mealType, foodItem, calories } = req.body;
    const { id: authorId, name } = req.user;
    try {

        const dietPlan = await prisma.dietPlan.create({
            data: {
                mealType,
                foodItem,
                calories,
                authorId,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                mealType: dietPlan.mealType,
                foodItem: dietPlan.foodItem,
                calories: dietPlan.calories,
                author: name,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create diet plan'
        });
    }
};

const get = async (req, res) => {
    try {
        const { id: authorId } = req.user;
        const dietPlan = await prisma.dietPlan.findMany({
            where: {
                authorId,
            },
            select: {
                id: true,
                mealType: true,
                foodItem: true,
                calories: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                    },
                }
            },
        });
        res.status(200).json({
            success: true,
            data: dietPlan,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve diet plans'
        });
    }
};

const getId = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: authorId } = req.user;
        const dietPlan = await prisma.dietPlan.findUnique({
            where: {
                id: parseInt(id),
                authorId,
            },
            select: {
                id: true,
                mealType: true,
                foodItem: true,
                createdAt: true,
                calories: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            }
        });
    
        res.status(200).json({
            success: true,
            data: dietPlan,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve diet plan'
        });
    }
};


const update = async (req, res) => {
    const { id } = req.params;
    const { mealType, foodItem, calories } = req.body;
    try {

        const dietPlan = await prisma.dietPlan.update({
            where: {
                id: parseInt(id),
            },
            data: {
                mealType,
                foodItem,
                calories,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Update data successfully',
            data: dietPlan,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update diet plan'
        });
    }
};


const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const dietPlan = await prisma.dietPlan.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({
            success: true,
            message: 'Delete data successfully',
            data: dietPlan,
        })
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete diet plan' });
    }
};

export default { create, get, getId, update, remove };