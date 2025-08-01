const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_key');
const Appointment = require('../models/Appointment');

exports.createPaymentIntent = async (req, res) => {
    try {
        const { appointmentId, amount } = req.body;

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            meta {
                appointmentId: appointmentId
            }
        });

        // Update appointment with payment intent ID
        await Appointment.findByIdAndUpdate(appointmentId, {
            paymentIntentId: paymentIntent.id
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { appointmentId, paymentIntentId } = req.body;

        // Update appointment payment status
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                paymentStatus: 'paid'
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Payment confirmed successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
