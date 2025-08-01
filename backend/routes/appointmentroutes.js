const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/appointments', auth, appointmentController.createAppointment);
router.get('/appointments', auth, appointmentController.getAppointments);
router.put('/appointments/:id/status', auth, adminAuth, appointmentController.updateAppointmentStatus);
router.delete('/appointments/:id', auth, adminAuth, appointmentController.deleteAppointment);

module.exports = router;
