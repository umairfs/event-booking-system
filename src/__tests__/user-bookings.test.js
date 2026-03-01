const request = require('supertest');
const app = require('../app');

// Mock booking service
jest.mock('../services/booking.service', () => ({
    getUserBookings: jest.fn()
}));

// Mock auth middleware to simulate logged-in user
jest.mock('../middlewares/auth.middleware', () => {
    return (req, res, next) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        req.user = { id: 101 };
        next();
    };
});

const bookingService = require('../services/booking.service');

describe('GET /api/bookings/my', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return current user bookings successfully', async () => {

        bookingService.getUserBookings.mockResolvedValue({
            status: 200,
            message: 'Bookings fetched successfully',
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
            .get('/api/bookings/my')
            .set('Authorization', 'Bearer fake-jwt-token'); // simulate token

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].eventName).toBe('Music Concert');
    });

    it('should return empty array if no bookings found', async () => {

        bookingService.getUserBookings.mockResolvedValue({
            status: 200,
            message: 'No bookings found',
            data: []
        });

        const res = await request(app)
            .get('/api/bookings/my')
            .set('Authorization', 'Bearer fake-jwt-token');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(0);
    });

    it('should return 401 if no token provided', async () => {

        const res = await request(app)
            .get('/api/bookings/my');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should return 500 if service throws error', async () => {

        bookingService.getUserBookings.mockRejectedValue(
            new Error('DB failure')
        );

        const res = await request(app)
            .get('/api/bookings/my')
            .set('Authorization', 'Bearer fake-jwt-token');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});