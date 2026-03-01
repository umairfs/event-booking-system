const eventRepository = require('../repositories/event.repository');

const getEvents = async () => {
    return await eventRepository.getAllEvents();
};

module.exports = {
    getEvents,
};