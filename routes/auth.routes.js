import express from 'express';
import pool from '../config/db.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body||{};
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const result = await pool.query('SELECT id, name, role, email FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ user: result.rows[0] });
});
export default router;