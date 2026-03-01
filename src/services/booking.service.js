const pool = require('../config/database');
const eventRepository = require('../repositories/event.repository');
const bookingRepository = require('../repositories/booking.repository');
const auditRepository = require('../repositories/audit.repository');

const bookEvent = async (eventId, userId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Lock event row
        const event = await eventRepository.getEventForUpdate(connection, eventId);

        if (!event) {
            await connection.rollback();
            return { status: 404, message: 'Event not found' };
        }

        // Check capacity
        if (event.booked_count >= event.total_capacity) {
            await connection.rollback();
            return { status: 409, message: 'Event sold out' };
        }

        // NEW: Check existing booking
        const existingBooking =
            await bookingRepository.getBookingByEventAndUser(
                connection,
                eventId,
                userId
            );

        let bookingId;

        if (existingBooking) {

            if (existingBooking.status === 'CONFIRMED') {
                await connection.rollback();
                return {
                    status: 400,
                    message: 'User already booked this event'
                };
            }

            // If CANCELLED → Reactivate booking
            if (existingBooking.status === 'CANCELLED') {

                await bookingRepository.reactivateBooking(
                    connection,
                    existingBooking.id
                );

                await eventRepository.incrementBookedCount(
                    connection,
                    eventId
                );

                bookingId = existingBooking.id;

                // Add audit entry
                await auditRepository.logAudit(
                    connection,
                    'REBOOK',
                    eventId,
                    bookingId,
                    userId,
                    'SUCCESS',
                    'Booking reactivated successfully'
                );

                await connection.commit();

                return {
                    status: 200,
                    message: 'Booking successful (re-activated)',
                    bookingId
                };
            }
        }

        // If no previous booking → Insert new
        bookingId = await bookingRepository.createBooking(
            connection,
            eventId,
            userId
        );

        await eventRepository.incrementBookedCount(
            connection,
            eventId
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

const getUserBookings = async (userId) => {
    try {
        const bookings = await bookingRepository.getBookingsByUserId(userId);

        return {
            status: 200,
            data: bookings.map(b => ({
                bookingId: b.booking_id,
                eventId: b.event_id,
                eventName: b.event_name,
                eventDescription: b.event_description,
                eventDate: b.event_date,
                status: b.status,
                createdAt: b.updated_at
            }))
        };

    } catch (error) {
        console.error('Fetch user bookings error:', error);

        return {
            status: 500,
            message: 'Internal Server Error'
        };
    }
};

module.exports = {
    bookEvent,
    cancelEventBooking,
    getUserBookings
};