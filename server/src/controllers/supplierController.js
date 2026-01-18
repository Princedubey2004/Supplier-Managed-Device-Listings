
const prisma = require('../db');

const getMyDevices = async (req, res) => {
    const { supplierId } = req.user;
    try {
        const devices = await prisma.device.findMany({
            where: { supplierId },
            include: { offers: true },
            orderBy: { createdAt: 'desc' },
        });
        const parsedDevices = devices.map(d => ({
            ...d,
            specs: JSON.parse(d.specs || '{}')
        }));
        res.json(parsedDevices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createDevice = async (req, res) => {
    const { supplierId } = req.user;
    const { name, brand, specs, basePrice, stockQuantity, imageUrl } = req.body;

    try {
        const device = await prisma.device.create({
            data: {
                supplierId,
                name,
                brand,
                specs: JSON.stringify(specs || {}), // SQLite stores as string
                basePrice,
                stockQuantity,
                imageUrl,
            },
        });
        res.status(201).json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDevice = async (req, res) => {
    const { id } = req.params;
    const { supplierId } = req.user;
    const data = req.body;

    try {
        // Verify ownership
        const device = await prisma.device.findUnique({ where: { id } });
        if (!device || device.supplierId !== supplierId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updated = await prisma.device.update({
            where: { id },
            data: {
                ...data,
                specs: data.specs ? JSON.stringify(data.specs || {}) : undefined
            },
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStock = async (req, res) => {
    const { id } = req.params;
    const { supplierId } = req.user;
    const { quantity, reason } = req.body; // New total quantity? Or change? Prompt says "Update stock quantity" and "Stock history tracking"

    // If quantity is absolute value, calculate change.
    // If change, just apply.
    // Let's assume input is New Total Quantity for simplicity in UI, but we record change.

    try {
        const device = await prisma.device.findUnique({ where: { id } });
        if (!device || device.supplierId !== supplierId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const change = quantity - device.stockQuantity;

        const [updatedDevice] = await prisma.$transaction([
            prisma.device.update({
                where: { id },
                data: { stockQuantity: quantity },
            }),
            prisma.stockHistory.create({
                data: {
                    deviceId: id,
                    change,
                    reason: reason || 'Supplier update',
                },
            }),
        ]);

        res.json(updatedDevice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createOffer = async (req, res) => {
    const { id } = req.params; // Device ID
    const { supplierId } = req.user;
    const { discount, startDate, endDate } = req.body;

    try {
        const device = await prisma.device.findUnique({ where: { id } });
        if (!device || device.supplierId !== supplierId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const offer = await prisma.offer.create({
            data: {
                deviceId: id,
                discount,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });
        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMyDevices, createDevice, updateDevice, updateStock, createOffer };
