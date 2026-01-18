import express from "express";
import pool from "../config/db.js";
import Auth from "../middleware/auth.middleware.js";
import Roles from "../middleware/role.middleware.js";
const router = express.Router();

router.post("/check-in", Auth, Roles("security"), async (req, res) => {
    const { access_code } = req.body||{};
    if (!access_code) {
        return res.status(400).json({ message: "Access code is required" });
    }
    const result = await pool.query("SELECT * FROM visits WHERE access_code = $1", [access_code]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Visit not found" });
    }
    const visit = result.rows[0];
    if (visit.status !== "pending") {
        return res.status(400).json({ message: "Visit already checked in or completed" });
    }
    await pool.query("UPDATE visits SET check_in_time=NOW(), status = 'checked_in' WHERE access_code = $1 AND check_in_time IS NULL RETURNING *", [access_code]);
    res.json({ message: "Check-in successful", visit });
});
router.post("/check-out", Auth, Roles("security"), async (req, res) => {
    const { access_code } = req.body||{};
    if (!access_code) {
        return res.status(400).json({ message: "Access code is required" });
    }
    const result = await pool.query("SELECT * FROM visits WHERE access_code = $1", [access_code]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Visit not found" });
    }
    const visit = result.rows[0];
    if (visit.status !== "checked_in") {
        return res.status(400).json({ message: "Visit not checked in or already completed" });
    }   
    await pool.query("UPDATE visits SET check_out_time=NOW(), status = 'completed' WHERE access_code = $1 AND check_out_time IS NULL RETURNING *", [access_code]);
    res.json({ message: "Check-out successful", visit });
});
export default router;