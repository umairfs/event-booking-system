const request = require('supertest');
const app = require('../app');

// Mock service
jest.mock('../services/event.service', () => ({
    getEvents: jest.fn()
}));

const eventService = require('../services/event.service');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
});

describe('GET /api/events', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return list of events with success true', async () => {

        eventService.getEvents.mockResolvedValue([
                {
                    id: 1,
                    name: 'Music Concert',
                    description: 'Arjit Singh',
                    total_capacity: 100,
                    booked_count: 20,
                    remaining_spots: 80,
                    event_date: '2026-03-10'
                }
            ]
        );

        const res = await request(app).get('/api/events');
        expect(res.body.success).toBe(true);
    });

    it('should return empty array if no events found', async () => {

        eventService.getEvents.mockResolvedValue([]);

        const res = await request(app).get('/api/events');
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(0);
    });

    it('should return 500 if service throws error', async () => {

        eventService.getEvents.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/api/events');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBeDefined();
    });
});