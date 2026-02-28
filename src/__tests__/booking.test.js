const request = require('supertest');
const app = require('../app');

// Mock booking service
jest.mock('../services/booking.service', () => ({
    bookEvent: jest.fn()
}));

const bookingService = require('../services/booking.service');

describe('POST /api/booking/events/:id/book', () => {

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
            .post('/api/booking/events/1/book')
            .send({ userId: 101 });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.bookingId).toBe(10);
    });

    it('should return 409 if sold out', async () => {

        bookingService.bookEvent.mockResolvedValue({
            status: 409,
            message: 'Event sold out'
        });

        const res = await request(app)
            .post('/api/booking/events/1/book')
            .send({ userId: 101 });

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 if userId missing', async () => {

        const res = await request(app)
            .post('/api/booking/events/1/book')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});