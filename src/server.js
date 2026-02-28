const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected Successfully');
        connection.release();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('DB connection failed', err);
    }
})();