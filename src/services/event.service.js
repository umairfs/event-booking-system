const eventRepository = require('../repositories/event.repository');

const getEvents = async () => {
    const events = await eventRepository.getAllEvents();

    return events.map(event => ({
        id: event.id,
        name: event.name,
        totalCapacity: event.total_capacity,
        bookedCount: event.booked_count,
        remainingSpots: event.remaining_spots,
        eventDate: event.event_date
    }));
};



module.exports = {
    getEvents,
};