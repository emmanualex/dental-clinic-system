const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
    try {
        const { patientName, email, phone, date, time, service, message } = req.body;
        
        const appointmentData = {
            patientName,
            email,
            phone,
            date,
            time,
            service,
            message
        };

        // If user is logged in, associate with user
        if (req.user) {
            appointmentData.user = req.user._id;
        }

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();
        
        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully!',
             savedAppointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        let query = {};
        
        // If user is not admin, only show their appointments
        if (req.user && req.user.role !== 'admin') {
            query = { user: req.user._id };
        }

        const appointments = await Appointment.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment status updated',
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
