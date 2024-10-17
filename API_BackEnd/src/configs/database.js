const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB successfully!!!');
    } catch (error) {
        console.error('Connect failure!!!', error);
        process.exit(1);
    }
}

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected!');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB is disconnected!');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to application termination');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

module.exports = { connect };
