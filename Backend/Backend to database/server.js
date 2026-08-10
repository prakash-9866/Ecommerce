const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app');

dotenv.config({ path: __dirname + '/.env' });


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} 🚀`);
});