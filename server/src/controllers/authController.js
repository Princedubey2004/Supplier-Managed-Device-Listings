
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const register = async (req, res) => {
    const { email, password, role, name } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to ensure Supplier is created if role is SUPPLIER
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                },
            });

            if (role === 'SUPPLIER') {
                if (!name) throw new Error('Supplier name is required');
                await tx.supplier.create({
                    data: {
                        name,
                        userId: user.id,
                    },
                });
            }

            return user;
        });

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
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.supplier?.name || user.email,
                supplierId: user.supplier?.id,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };
