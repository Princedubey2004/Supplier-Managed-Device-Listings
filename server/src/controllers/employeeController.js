
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
        const result = await prisma.$transaction(async (tx) => {
            // Lock device row? Prisma handles optimistic concurrency, or we can just check.
            // For strict atomicity, a raw query or updating count with logic is better.
            // updateMany with where quantity > 0 returns count.

            // 1. Check/Update Stock
            const device = await tx.device.findUnique({ where: { id } });
            if (!device || !device.active) throw new Error('Device not available');
            if (device.stockQuantity <= 0) throw new Error('Out of stock');

            const updated = await tx.device.update({
                where: { id },
                data: { stockQuantity: { decrement: 1 } },
            });

            if (updated.stockQuantity < 0) {
                throw new Error('Race condition: Out of stock'); // Start over if this happens theoretically
            }

            // Calculate price at lease
            // Need to fetch active offers again within transaction to be sure of price?
            // For now, base price * discount.
            // Ideally we re-fetch offers here.
            const activeOffer = await tx.offer.findFirst({
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
            const lease = await tx.lease.create({
                data: {
                    deviceId: id,
                    userId,
                    priceAtLease: price,
                },
            });

            // 3. Stock History
            await tx.stockHistory.create({
                data: {
                    deviceId: id,
                    change: -1,
                    reason: `Leased by Employee ${userId}`,
                },
            });

            return lease;
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getDevices, leaseDevice };
