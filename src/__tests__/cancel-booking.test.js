const request = require('supertest');
const app = require('../app');

// Mock booking service
jest.mock('../services/booking.service', () => ({
    cancelEventBooking: jest.fn()
}));

const bookingService = require('../services/booking.service');

describe('POST /api/booking/:id/cancel', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should cancel booking successfully', async () => {

        bookingService.cancelEventBooking.mockResolvedValue({
            status: 200,
            message: 'Booking cancelled successfully'
        });

        const res = await request(app)
            .post('/api/booking/5/cancel');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Booking cancelled successfully');
    });

    it('should return 404 if booking not found', async () => {

        bookingService.cancelEventBooking.mockResolvedValue({
            status: 404,
            message: 'Booking not found'
        });

        const res = await request(app)
            .post('/api/booking/999/cancel');

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Booking not found');
    });

    it('should return 400 if already cancelled', async () => {

        bookingService.cancelEventBooking.mockResolvedValue({
            status: 400,
            message: 'Booking already cancelled'
        });

        const res = await request(app)
            .post('/api/booking/5/cancel');

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Booking already cancelled');
    });

    it('should return 500 on unexpected error', async () => {

        bookingService.cancelEventBooking.mockResolvedValue({
            status: 500,
            message: 'Internal Server Error'
        });

        const res = await request(app)
            .post('/api/booking/5/cancel');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});