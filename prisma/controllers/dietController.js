// Import the necessary dependencies
import { PrismaClient } from '@prisma/client';
// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Create a new dietPlan
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

// Get all dietPlans
const get = async (req, res) => {
    try {
        const dietPlan = await prisma.dietPlan.findMany({
            select: {
                id: true,
                mealType: true,
                foodItem: true,
                calories: true,
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

// Get a single dietPlan by ID
const getId = async (req, res) => {
    const { id } = req.params;
    try {
        const dietPlan = await prisma.dietPlan.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                mealType: true,
                foodItem: true,
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

// Update a dietPlan by ID
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

// Delete a dietPlan by ID
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