const eventService = require('../services/event.service');

const getEvents = async (req, res) => {
    try {
        const events = await eventService.getEvents();
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    getEvents
};