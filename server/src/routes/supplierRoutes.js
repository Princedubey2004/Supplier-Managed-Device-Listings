
const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getMyDevices, createDevice, updateDevice, updateStock, createOffer } = require('../controllers/supplierController');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole('SUPPLIER'));

router.get('/devices', getMyDevices);
router.post('/devices', createDevice);
router.put('/devices/:id', updateDevice);
router.patch('/devices/:id/stock', updateStock);
router.post('/devices/:id/offer', createOffer);

module.exports = router;
