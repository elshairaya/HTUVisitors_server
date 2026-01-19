import express from "express";
import pool from "../config/db.js";
import Auth from "../middleware/auth.middleware.js";
import Roles from "../middleware/role.middleware.js";
import { handleOverdueVisits } from "../utils/overdue.js";
const router = express.Router();
router.post("/validate", Auth, Roles("security"), async (req, res) => {
    const { access_code } = req.body||{};
    try {
        await handleOverdueVisits();
        const result = await pool.query("SELECT * FROM visits WHERE access_code = $1", [access_code]);
        if (!result.rows.length) {
            return res.status(404).json({ message: "Invalid access code" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error validating access code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/check-in", Auth, Roles("security"), async (req, res) => {
    
    try{
        await handleOverdueVisits();
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
        await pool.query("UPDATE visits SET check_in_time=NOW(), status = 'active' WHERE access_code = $1 AND check_in_time IS NULL RETURNING *", [access_code]);
        res.json({ message: "Check-in successful", visit });
    } catch (error) {
        console.error("Error during check-in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/check-out", Auth, Roles("security"), async (req, res) => {
   try{
    await handleOverdueVisits();
    const { access_code } = req.body||{};
    if (!access_code) {
        return res.status(400).json({ message: "Access code is required" });
    }   
    const result = await pool.query("SELECT * FROM visits WHERE access_code = $1", [access_code]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Visit not found" });
    }
    const visit = result.rows[0];
    if (visit.status !== "active") {
        return res.status(400).json({ message: "Visit not checked in or already completed" });
    }
    await pool.query("UPDATE visits SET check_out_time=NOW(), status = 'completed' WHERE access_code = $1 AND check_out_time IS NULL RETURNING *", [access_code]);
    res.json({ message: "Check-out successful", visit });
   }
    catch (error) {
        console.error("Error during check-out:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;