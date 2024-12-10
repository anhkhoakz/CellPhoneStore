const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing

const userRoles = {
    CUSTOMER: "customer",
    ADMIN: "admin",
};

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            min: 6,
            max: 255,
            trim: true,
            required: true,
            index: true,
        },
        email: {
            type: String,
            min: 6,
            max: 255,
            trim: true,
            validate: {
                validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: (props) => `${props.value} is not a valid email!`,
            },
            required: true,
            unique: true,
        },
        password: {
            type: String,
            min: 8,
            max: 124,
        },
        phone: {
            type: String,
            min: 10,
            max: 10,
            trim: true,
        },
        addresses: [
            {
                village: { type: String, trim: true },
                city: { type: String, trim: true },
                district: { type: String, trim: true },
                detail: { type: String, trim: true },
                receiver: { type: String, trim: true },
                phone: { type: String, min: 10, max: 10, trim: true },
                isDefault: { type: Boolean, default: false },
            },
        ],
        role: {
            type: String,
            enum: Object.values(userRoles),
            default: userRoles.CUSTOMER,
        },
        resetToken: { type: String, default: null },
        resetTokenExpiry: { type: Date, default: null },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        note: { type: String, trim: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User = mongoose.model("Account", userSchema);

const seedAdminUser = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/CellPhoneStore"
        );

        // Check if an admin already exists
        const adminExists = await User.findOne({ role: userRoles.ADMIN });
        if (adminExists) {
            console.log("Admin user already exists. No new admin created.");
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash("admin", 10);

        // Create a new admin user
        const adminUser = new User({
            username: "Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: userRoles.ADMIN,
        });

        // Save the admin user to the database
        await adminUser.save();
        console.log("Admin user created:", adminUser);
    } catch (error) {
        console.error("Error seeding admin user:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdminUser();
