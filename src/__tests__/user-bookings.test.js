const request = require('supertest');
const app = require('../app');

// Mock booking service
jest.mock('../services/booking.service', () => ({
    getUserBookings: jest.fn()
}));

const bookingService = require('../services/booking.service');

describe('GET /api/users/:userId/bookings', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user bookings successfully', async () => {

        bookingService.getUserBookings.mockResolvedValue({
            status: 200,
            data: [
                {
                    bookingId: 1,
                    eventId: 10,
                    eventName: 'Music Concert',
                    eventDate: '2026-03-10',
                    status: 'CONFIRMED',
                    createdAt: '2026-02-20'
                }
            ]
        });

        const res = await request(app)
            .get('/api/users/101/bookings');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].eventName).toBe('Music Concert');
    });

    it('should return empty array if no bookings found', async () => {

        bookingService.getUserBookings.mockResolvedValue({
            status: 200,
            data: []
        });

        const res = await request(app)
            .get('/api/users/200/bookings');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(0);
    });

    it('should return 500 if service fails', async () => {

        bookingService.getUserBookings.mockResolvedValue({
            status: 500,
            message: 'Internal Server Error'
        });

        const res = await request(app)
            .get('/api/users/101/bookings');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});