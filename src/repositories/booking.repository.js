const pool = require('../config/database');

const createBooking = async (connection, eventId, userId) => {
    const [result] = await connection.query(
        `INSERT INTO bookings (event_id, user_id, status)
         VALUES (?, ?, 'CONFIRMED')`,
        [eventId, userId]
    );

    return result.insertId;
};

const getBookingForUpdate = async (connection, bookingId) => {
    const [rows] = await connection.query(
        `SELECT * FROM bookings WHERE id = ? FOR UPDATE`,
        [bookingId]
    );

    return rows[0];
};

const cancelBooking = async (connection, bookingId) => {
    await connection.query(
        `UPDATE bookings 
         SET status = 'CANCELLED'
         WHERE id = ?`,
        [bookingId]
    );
};

const getBookingsByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT 
            b.id AS booking_id,
            b.status,
            b.created_at,
            e.id AS event_id,
            e.name AS event_name,
            e.event_date
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `, [userId]);

    return rows;
};

module.exports = {
    createBooking,
    getBookingForUpdate,
    cancelBooking,
    getBookingsByUserId
};
