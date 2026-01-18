
const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getDevices, leaseDevice } = require('../controllers/employeeController');

const router = express.Router();

router.use(authenticateToken);
// "Employee" can view devices, but maybe general public? Prompt says "Employee (views and leases)".
// We'll enforce Employee role for now, or just authentication.

router.get('/devices', authorizeRole('EMPLOYEE'), getDevices);
router.post('/devices/:id/lease', authorizeRole('EMPLOYEE'), leaseDevice);

module.exports = router;
