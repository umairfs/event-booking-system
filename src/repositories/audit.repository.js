const logAudit = async (
    connection,
    operationType,
    eventId,
    bookingId,
    userId,
    outcome,
    message
) => {
    await connection.query(
        `INSERT INTO audit_logs 
        (operation_type, event_id, booking_id, user_id, outcome, message)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [operationType, eventId, bookingId, userId, outcome, message]
    );
};

module.exports = {
    logAudit
};