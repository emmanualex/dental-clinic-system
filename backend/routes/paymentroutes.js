const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);
router.post('/confirm-payment', auth, paymentController.confirmPayment);

module.exports = router;
