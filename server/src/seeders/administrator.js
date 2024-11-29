// seed.js
const User = require('../api/v1/models/Account');

const seedAdminUser = async () => {
    try {
        // Check if an admin already exists
        const adminExists = await User.countDocuments({ role: 'admin' });

        if (adminExists > 0) {
            console.log('Admin user already exists. No new admin created.');
            return;
        }

        // Create a new admin user
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123', // Make sure to hash this in a real app
            role: 'admin',
        });

        // Save the admin user to the database
        await adminUser.save();
        console.log('Admin user created:', adminUser);
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

seedAdminUser();
