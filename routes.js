const express = require('express');
const AlarmController = require('./Controllers/AlarmController');
const ORM = require('./Models');

const router = express.Router();

const orm = new ORM({
    host: 'db',
    user: 'root',
    password: 'rootpassword',
    database: 'plate_db',
});

const alarmController = new AlarmController(orm);

router.post('/SendAlarmData', (req, res) => {
    alarmController.processAlarmData(req, res);
});

module.exports = router;
