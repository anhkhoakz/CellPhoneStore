require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;
const hostName = process.env.HOST_NAME || 'localhost';
const version = process.env.VERSION || 'v1';

app.listen(port, hostName, () => {
    console.log(`Server is running on http://${hostName}:${port}/${version}`);
});