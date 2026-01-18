
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
                specs: JSON.stringify(specs || {}),
                basePrice: parseFloat(basePrice),
                stockQuantity: parseInt(stockQuantity, 10),
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

        const updateData = {
            ...data,
            specs: data.specs ? JSON.stringify(data.specs || {}) : undefined
        };

        // Convert numeric fields if present
        if (data.basePrice !== undefined) updateData.basePrice = parseFloat(data.basePrice);
        if (data.stockQuantity !== undefined) updateData.stockQuantity = parseInt(data.stockQuantity, 10);

        const updated = await prisma.device.update({
            where: { id },
            data: updateData,
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStock = async (req, res) => {
    const { id } = req.params;
    const { supplierId } = req.user;
    const { quantity, reason } = req.body;

    try {
        const device = await prisma.device.findUnique({ where: { id } });
        if (!device || device.supplierId !== supplierId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const newQuantity = parseInt(quantity, 10);
        const change = newQuantity - device.stockQuantity;

        const [updatedDevice] = await prisma.$transaction([
            prisma.device.update({
                where: { id },
                data: { stockQuantity: newQuantity },
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
                discount: parseFloat(discount),
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
