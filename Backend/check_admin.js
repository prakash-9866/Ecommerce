const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@example.com';
        const password = 'password123';
        
        const user = await User.findOne({ email }).select('+password');
        if (user) {
            console.log('Admin found.');
            const isMatch = await user.matchPassword(password);
            console.log(`Password match: ${isMatch}`);
            console.log(`Is Admin: ${user.isAdmin}`);
        } else {
            console.log('Admin NOT found!');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
