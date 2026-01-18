import pool from '../config/db.config.js';

const authMiddleware = async (req, res, next) => {
    const userId = req.header["x-user-id"];
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: No user ID provided" });
    }
    const result = await pool.query('SELECT id,name,role FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Unauthorized: Invalid user ID" });
    }
    req.user = result.rows[0];
    next();
};

export default authMiddleware;