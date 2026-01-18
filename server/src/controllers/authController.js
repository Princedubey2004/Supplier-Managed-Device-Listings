
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const register = async (req, res) => {
    const { email, password, role, name } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create User
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                name: name || undefined, // Save name if provided
            },
        });

        // 2. Create Supplier if needed
        if (role === 'SUPPLIER') {
            if (!name) {
                // Rollback: Delete user if supplier validation fails
                await prisma.user.delete({ where: { id: user.id } });
                throw new Error('Supplier name is required');
            }
            try {
                await prisma.supplier.create({
                    data: {
                        name,
                        userId: user.id,
                    },
                });
            } catch (supplierError) {
                // Rollback: Delete user if supplier creation fails
                await prisma.user.delete({ where: { id: user.id } });
                throw supplierError;
            }
        }

        const result = user;

        res.status(201).json({ message: 'User created successfully', userId: result.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { supplier: true }, // Include supplier info if exists
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, supplierId: user.supplier?.id },
            process.env.JWT_SECRET || 'supersecret_tortoise_key',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name || user.supplier?.name || user.email, // Prefer user.name, fallback to supplier name or email
                avatarUrl: user.avatarUrl,
                supplierId: user.supplier?.id,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.user; // From middleware
    const { name, avatarUrl } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                avatarUrl,
            },
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                name: updatedUser.name,
                avatarUrl: updatedUser.avatarUrl,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, updateProfile };
