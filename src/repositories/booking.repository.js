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

module.exports = {
    createBooking,
    getBookingForUpdate,
    cancelBooking
};
