const express = require('express');
const router = require('./routes.js');

const app = express();

app.use(bodyParser.text({ type: 'application/xml', limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const IP_ADDRESS = '0.0.0.0';
const PORT = 3000;
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${PORT}/SendAlarmData`);
});
