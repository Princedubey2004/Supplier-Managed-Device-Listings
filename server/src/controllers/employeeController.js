
const prisma = require('../db');

const getDevices = async (req, res) => {
    const { brand, minPrice, maxPrice } = req.query;

    const where = {
        active: true,
        stockQuantity: { gt: 0 },
    };

    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = parseFloat(minPrice);
        if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    try {
        const devices = await prisma.device.findMany({
            where,
            include: {
                offers: {
                    where: {
                        startDate: { lte: new Date() },
                        endDate: { gte: new Date() },
                    }
                },
                supplier: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate current price
        const devicesWithPrice = devices.map(d => {
            let finalPrice = parseFloat(d.basePrice);
            let discount = 0;
            if (d.offers.length > 0) {
                // Assume best offer or first active offer?
                // Let's take the highest discount
                const bestOffer = d.offers.reduce((prev, current) => (prev.discount > current.discount) ? prev : current);
                discount = parseFloat(bestOffer.discount);
                finalPrice = finalPrice * (1 - discount / 100);
            }
            return {
                ...d,
                finalPrice: finalPrice.toFixed(2),
                activeDiscount: discount,
                specs: JSON.parse(d.specs || '{}')
            };
        });

        res.json(devicesWithPrice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const leaseDevice = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user; // Employee ID

    try {
        // Transaction removed for local MongoDB standalone support

        // 1. Check/Update Stock
        const device = await prisma.device.findUnique({ where: { id } });
        if (!device || !device.active) throw new Error('Device not available');
        if (device.stockQuantity <= 0) throw new Error('Out of stock');

        // Optimistic update: Decrement stock
        const updated = await prisma.device.update({
            where: { id },
            data: { stockQuantity: { decrement: 1 } },
        });

        if (updated.stockQuantity < 0) {
            // Revert update if stock accidentally went below 0 (though we checked before)
            // This is a basic race condition check
            await prisma.device.update({
                where: { id },
                data: { stockQuantity: { increment: 1 } },
            });
            throw new Error('Race condition: Out of stock');
        }

        // Calculate price at lease
        const activeOffer = await prisma.offer.findFirst({
            where: {
                deviceId: id,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
            orderBy: { discount: 'desc' },
        });

        let price = parseFloat(device.basePrice);
        if (activeOffer) {
            price = price * (1 - parseFloat(activeOffer.discount) / 100);
        }

        // 2. Create Lease
        // If this fails, we should ideally revert the stock update.
        let lease;
        try {
            lease = await prisma.lease.create({
                data: {
                    deviceId: id,
                    userId,
                    priceAtLease: price,
                },
            });
        } catch (leaseError) {
            await prisma.device.update({
                where: { id },
                data: { stockQuantity: { increment: 1 } },
            });
            throw leaseError;
        }

        // 3. Stock History
        try {
            await prisma.stockHistory.create({
                data: {
                    deviceId: id,
                    change: -1,
                    reason: `Leased by Employee ${userId}`,
                },
            });
        } catch (historyError) {
            // Non-critical, just log it. Data consistency for history is secondary to lease creation.
            console.error('Failed to create stock history:', historyError);
        }

        const result = lease;

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getDevices, leaseDevice };
