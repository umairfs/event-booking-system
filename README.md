# EVENT BOOKING SYSTEM

A backend system built using Node.js, Express, and MySQL that allows
users to view events, book tickets, cancel bookings, and view booking
history.

This system is designed with:

-   Concurrency-safe booking
-   Transaction management
-   Rate limiting protection
-   Input validation
-   Audit logging
-   Clean layered architecture

------------------------------------------------------------------------

# TECH STACK

-   Node.js
-   Express.js
-   MySQL (InnoDB)
-   Jest + Supertest (Testing)
-   express-validator (Validation)
-   express-rate-limit (API Protection)

------------------------------------------------------------------------

# ARCHITECTURE OVERVIEW

The application follows a clean layered architecture:

Routes → Validation → Controller → Service → Database

# Responsibilities:

Routes: API endpoint definitions Validation: Request validation rules
Controller: Handles request and response Service: Business logic and
transaction handling Database: MySQL queries

This separation ensures maintainability, scalability, testability, and
clean code organization.

------------------------------------------------------------------------

# API ENDPOINTS

# 1)  Get All Events GET /api/events

Returns list of available events with seat availability.

------------------------------------------------------------------------

# 2)  Book Event POST /api/booking/events/:id/book

Request Body: { “userId”: 101 }

Features: - Transaction-based booking - Row-level locking using SELECT …
FOR UPDATE - Prevents overselling - Rate limited (5 requests per minute
per IP)

------------------------------------------------------------------------

# 3)  Cancel Booking POST /api/booking/:id/cancel

-   Restores seat count
-   Updates booking status
-   Maintains audit trail

------------------------------------------------------------------------

# 4)  Get User Bookings GET /api/users/:userId/bookings

Returns booking history of a user.

------------------------------------------------------------------------

# CONCURRENCY HANDLING STRATEGY

To prevent overselling:

1.  Booking runs inside a database transaction
2.  Event row is locked using: SELECT * FROM events WHERE id = ? FOR
    UPDATE
3.  Seat count is validated inside the transaction
4.  Booking and seat update happen atomically
5.  Transaction commits only if all operations succeed

This ensures: - No race conditions - No double booking - No inconsistent
seat count

------------------------------------------------------------------------

# SECURITY AND PROTECTION

Input Validation: All endpoints validate required fields, parameter
types, and numeric constraints using express-validator.

Rate Limiting: The booking API (POST /api/booking/events/:id/book) is
limited to 5 requests per minute per IP.

This prevents: - Abuse - Brute-force booking attempts - Accidental rapid
retries

Error Handling: Standardized error responses:

{ “success”: false, “message”: “Error message” }

------------------------------------------------------------------------

# AUDIT LOGGING

All booking actions (success and failure) are logged for traceability.

Maintains: - Booking attempts - Cancellation logs - Status changes

------------------------------------------------------------------------

# RUNNING TESTS

Test framework used: - Jest - Supertest

Run: npm test

Test coverage includes: - Successful booking - Sold out scenario -
Invalid input - Cancel booking - Get user bookings - Error scenarios

------------------------------------------------------------------------

# INSTALLATION AND SETUP

1)  Clone Repository git clone cd event-booking-system

2)  Install Dependencies npm install

3)  Configure Environment Variables

Create a .env file from .env.example present in repo and fill the required details in it as per your local system.

4)  Run Server npm start

Server runs at: http://localhost:5000||PORT

------------------------------------------------------------------------

DESIGN ASSUMPTIONS

-   Users already exist (no authentication required)
-   Booking is limited to 1 seat per request
-   No payment integration included
-   Rate limiting uses in-memory store (single-instance deployment)
-   MySQL engine assumed as InnoDB

------------------------------------------------------------------------

FUTURE ENHANCEMENTS

-   Authentication and Authorization
-   Redis-based distributed rate limiting
-   Pagination for events
-   API documentation (Swagger)
-   Caching for read-heavy endpoints
-   Docker containerization
-   Load testing and monitoring

------------------------------------------------------------------------

PRODUCTION CONSIDERATIONS

This implementation focuses not only on functional requirements but also
on production-grade backend concerns such as:

-   Concurrency safety
-   Atomic transactions
-   Input validation
-   Abuse protection
-   Clean architecture
-   Test coverage

------------------------------------------------------------------------

AUTHOR:
Umair Shah
Senior Software Engineer
Email: umair.fs07@gmail.com
GitHub: https://github.com/umairfs/event-booking-system/tree/main

Developed as part of a backend system design assignment.