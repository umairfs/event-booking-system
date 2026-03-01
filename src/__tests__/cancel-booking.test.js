const request = require('supertest');
const app = require('../app');

// Mock booking service
jest.mock('../services/booking.service', () => ({
    bookEvent: jest.fn()
}));

// Mock auth middleware
jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
    req.user = { id: 101 }; // fake logged-in user
    next();
});

const bookingService = require('../services/booking.service');

describe('POST /api/bookings/events/:id/book', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should book event successfully', async () => {

        bookingService.bookEvent.mockResolvedValue({
            status: 200,
            message: 'Booking successful',
            bookingId: 10
        });

        const res = await request(app)
            .post('/api/bookings/events/1/book');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Booking successful');
    });

    it('should re-activate cancelled booking successfully', async () => {

        bookingService.bookEvent.mockResolvedValue({
            status: 200,
            message: 'Booking successful (re-activated)',
            bookingId: 10
        });

        const res = await request(app)
            .post('/api/bookings/events/1/book');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('re-activated');
    });

    it('should return 409 if sold out', async () => {

        bookingService.bookEvent.mockResolvedValue({
            status: 409,
            message: 'Event sold out'
        });

        const res = await request(app)
            .post('/api/bookings/events/1/book');

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Event sold out');
    });

    it('should return 400 if already booked', async () => {

        bookingService.bookEvent.mockResolvedValue({
            status: 400,
            message: 'User already booked this event'
        });

        const res = await request(app)
            .post('/api/bookings/events/1/book');

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return 500 on unexpected error', async () => {

        bookingService.bookEvent.mockRejectedValue(new Error('DB crash'));

        const res = await request(app)
            .post('/api/bookings/events/1/book');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});