const request = require('supertest');
const app = require('../app');

// Mock service
jest.mock('../services/event.service', () => ({
    getEvents: jest.fn()
}));

const eventService = require('../services/event.service');

describe('GET /events', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return list of events', async () => {

        eventService.getEvents.mockResolvedValue([
            {
                id: 1,
                name: 'Music Concert',
                totalCapacity: 100,
                bookedCount: 20,
                remainingSpots: 80,
                eventDate: '2026-03-10'
            }
        ]);

        const res = await request(app).get('/api/events');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe('Music Concert');
    });

    it('should return 500 if service throws error', async () => {

        eventService.getEvents.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/api/events');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});