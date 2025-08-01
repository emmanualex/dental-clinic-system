const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        const savedContact = await contact.save();
        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
             savedContact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
