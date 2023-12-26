import { PrismaClient } from '@prisma/client';
import { format, parse, parseISO } from 'date-fns';

const prisma = new PrismaClient();

const create = async (req, res) => {
    const { title, description, category, amount, date } = req.body;
    const { id: authorId, name } = req.user;

    try {
        const financialRecord = await prisma.financialRecord.create({
            data: {
                title,
                description,
                category,
                amount,
                date: parse(date, 'dd-MM-yyyy', new Date()),
                authorId,
            },
        });

        res.json({
            success: true,
            data: {
                title: financialRecord.title,
                description: financialRecord.description,
                category: financialRecord.category,
                amount: financialRecord.amount,
                date: format(financialRecord.date, 'dd-MM-yyyy'),
                author: name,
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
          message: error.message
        });
    }
};

const get = async (req, res) => {
    try {
        const { id: authorId } = req.user;
        const financialRecord = await prisma.financialRecord.findMany({
            where: {
                authorId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                amount: true,
                date: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: financialRecord,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve financial records'
        });
    }
};

const getId = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: authorId } = req.user;
        const financialRecord = await prisma.financialRecord.findUnique({
            where: {
                id: parseInt(id),
                authorId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                amount: true,
                date: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            }
        });
        res.status(200).json({
            success: true,
            data: financialRecord
        });
    } catch (error) {
        res.status(500).json({
          error: 'Failed to retrieve financial record'
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, amount, date } = req.body;
    try {
        const financialRecord = await prisma.financialRecord.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                category,
                amount,
                date: parseISO(date),

            },
        });
        res.status(200).json({
            success: true,
            message: 'Financial Record updated successfully',
            data: financialRecord,
        });
    } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to update financial record'
        });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;
    try {
        const isTimeManagementAvailable = await prisma.financialRecord.findUnique({
            where: {
                id: parseInt(id)
            },
        })
        if (!isTimeManagementAvailable) {
            return res.status(404).json({
                error: 'TimeManagement entry not found'
            });
        }
        const financialRecord = await prisma.financialRecord.delete({
            where: {
                id: parseInt(id)
            },
        });
        res.json({
            success: true,
            message: 'Financial Record deleted successfully',
            data: financialRecord,
        });
    } catch (error) {
        res.status(500).json({
          error: 'Failed to delete financial record'
        });
    }
};

export default { get, getId, create, remove, update };
