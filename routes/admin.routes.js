import express from "express";
import pool from "../config/db.js";
import Auth from "../middleware/auth.middleware.js";
import Roles from "../middleware/role.middleware.js";
const router = express.Router();

router.get("/users", Auth, Roles("admin"), async (req, res) => {
    const result = await pool.query("SELECT id, name, email, username, role FROM users ORDER BY id");
    res.json(result.rows);
});
router.post("/users", Auth, Roles("admin"), async (req, res) => {
    const { name, email, username, password, role } = req.body||{};
    if (!name || !email || !username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }   
    await pool.query("INSERT INTO users (name, email, username, password, role) VALUES ($1, $2, $3, $4, $5)", [name, email, username, password, role]);
    res.status(201).json({ message: "User created successfully" });
});
router.delete("/users/:id", Auth, Roles("admin"), async (req, res) => {
    const userId = req.params.id;
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "User deleted successfully" });
});
export default router;