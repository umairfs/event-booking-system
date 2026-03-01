const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authenticate = require("../middlewares/auth.middleware");

router.get('/', authenticate, eventController.getEvents);

module.exports = router;