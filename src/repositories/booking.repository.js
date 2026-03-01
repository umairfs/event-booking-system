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
        SET status = 'CANCELLED',
            updated_at = NOW()
        WHERE id = ?`,
        [bookingId]
    );
};

const getBookingsByUserId = async (userId) => {
    const [rows] = await pool.query(`
        SELECT 
            b.id AS booking_id,
            b.status,
            b.updated_at,
            e.id AS event_id,
            e.name AS event_name,
            e.description AS event_description,
            e.event_date
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = ?
        ORDER BY b.updated_at DESC
    `, [userId]);

    return rows;
};

const getBookingByEventAndUser = async (connection, eventId, userId) => {
    const [rows] = await connection.execute(
        `SELECT * FROM bookings 
         WHERE event_id = ? AND user_id = ?`,
        [eventId, userId]
    );

    return rows[0];
};

const reactivateBooking = async (connection, bookingId) => {
    await connection.execute(
        `UPDATE bookings
         SET status = 'CONFIRMED',
         updated_at = NOW()
         WHERE id = ?`,
        [bookingId]
    );
};

module.exports = {
    createBooking,
    getBookingForUpdate,
    cancelBooking,
    getBookingsByUserId,
    getBookingByEventAndUser,
    reactivateBooking
};
