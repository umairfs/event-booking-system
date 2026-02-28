const pool = require('../config/database');
const eventRepository = require('../repositories/event.repository');
const bookingRepository = require('../repositories/booking.repository');
const auditRepository = require('../repositories/audit.repository');

const bookEvent = async (eventId, userId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        //  Lock event row
        const event = await eventRepository.getEventForUpdate(connection, eventId);

        if (!event) {
            await auditRepository.logAudit(
                connection,
                'BOOK',
                eventId,
                null,
                userId,
                'FAILURE',
                'Event not found'
            );

            await connection.rollback();

            return { status: 404, message: 'Event not found' };
        }

        //  Check capacity
        if (event.booked_count >= event.total_capacity) {
            await auditRepository.logAudit(
                connection,
                'BOOK',
                eventId,
                null,
                userId,
                'FAILURE',
                'Event sold out'
            );

            await connection.rollback();

            return { status: 409, message: 'Event sold out' };
        }

        let bookingId;

        try {
            //  Insert booking
            bookingId = await bookingRepository.createBooking(
                connection,
                eventId,
                userId
            );
        } catch (error) {
            //  Handle duplicate booking
            if (error.code === 'ER_DUP_ENTRY') {
                await auditRepository.logAudit(
                    connection,
                    'BOOK',
                    eventId,
                    null,
                    userId,
                    'FAILURE',
                    'User already booked this event'
                );

                await connection.rollback();

                return {
                    status: 400,
                    message: 'User already booked this event'
                };
            }

            throw error; //ethrow unexpected error
        }

        //  Increment capacity
        await eventRepository.incrementBookedCount(connection, eventId);

        //  Log success
        await auditRepository.logAudit(
            connection,
            'BOOK',
            eventId,
            bookingId,
            userId,
            'SUCCESS',
            'Booking successful'
        );

        await connection.commit();

        return {
            status: 200,
            message: 'Booking successful',
            bookingId
        };

    } catch (error) {
        await connection.rollback();

        console.error('Booking error:', error);

        return {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        connection.release();
    }
};

const cancelEventBooking = async (bookingId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        //  Lock booking
        const booking = await bookingRepository.getBookingForUpdate(
            connection,
            bookingId
        );

        if (!booking) {
            await auditRepository.logAudit(
                connection,
                'CANCEL',
                null,
                bookingId,
                null,
                'FAILURE',
                'Booking not found'
            );

            await connection.rollback();

            return { status: 404, message: 'Booking not found' };
        }

        if (booking.status === 'CANCELLED') {
            await auditRepository.logAudit(
                connection,
                'CANCEL',
                booking.event_id,
                bookingId,
                booking.user_id,
                'FAILURE',
                'Booking already cancelled'
            );

            await connection.rollback();

            return { status: 400, message: 'Booking already cancelled' };
        }

        //  Lock event row
        const event = await eventRepository.getEventForUpdate(
            connection,
            booking.event_id
        );

        //  Update booking
        await bookingRepository.cancelBooking(connection, bookingId);

        //  Decrement capacity
        await eventRepository.decrementBookedCount(
            connection,
            booking.event_id
        );

        //  Log success
        await auditRepository.logAudit(
            connection,
            'CANCEL',
            booking.event_id,
            bookingId,
            booking.user_id,
            'SUCCESS',
            'Booking cancelled successfully'
        );

        await connection.commit();

        return {
            status: 200,
            message: 'Booking cancelled successfully'
        };

    } catch (error) {
        await connection.rollback();

        console.error('Cancel error:', error);

        return {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        connection.release();
    }
};

module.exports = {
    bookEvent,
    cancelEventBooking
};