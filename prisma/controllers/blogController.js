import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const get = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getId = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const create = async (req, res) => {
    const { title, content, image } = req.body;
    const { id: authorId, name } = req.user;
    try {
        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                image,
                authorId,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                title: blog.title,
                content: blog.content,
                author: name,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { title, content, image } = req.body;

    try {
        const blog = await prisma.blog.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                content,
                image,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export default { get, getId, create, remove, update };