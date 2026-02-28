const pool = require('../config/database');

const getAllEvents = async () => {
    const [rows] = await pool.query(`
        SELECT 
            id,
            name,
            total_capacity,
            booked_count,
            (total_capacity - booked_count) AS remaining_spots,
            event_date
        FROM events
        ORDER BY event_date ASC
    `);

    return rows;
};

const getEventForUpdate = async (connection, eventId) => {
    const [rows] = await connection.query(
        `SELECT * FROM events WHERE id = ? FOR UPDATE`,
        [eventId]
    );

    return rows[0];
};

const incrementBookedCount = async (connection, eventId) => {
    await connection.query(
        `UPDATE events 
         SET booked_count = booked_count + 1 
         WHERE id = ?`,
        [eventId]
    );
};

const decrementBookedCount = async (connection, eventId) => {
    await connection.query(
        `UPDATE events 
         SET booked_count = booked_count - 1 
         WHERE id = ?`,
        [eventId]
    );
};

module.exports = {
    getAllEvents,
    getEventForUpdate,
    incrementBookedCount,
    decrementBookedCount
};
