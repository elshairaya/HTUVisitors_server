import express from "express";
import pool from "../config/db.js";
import Auth from "../middleware/auth.middleware.js";
import Roles from "../middleware/role.middleware.js";
import { handleOverdueVisits } from "../utils/overdue.js";
 
const router = express.Router();
router.get("/visits", Auth, Roles("staff"), async (req, res) => {
    await handleOverdueVisits();
    const {status} = req.query;
    const result = status
        ? await pool.query("SELECT * FROM visits WHERE status = $1 ORDER BY id DESC", [status])
        : await pool.query("SELECT * FROM visits ORDER BY id DESC");
    res.json(result.rows);
});
router.put("/visits", Auth, Roles("staff"), async (req, res) => {
     const { visitor_name, visitor_email, phone, host_name, purpose, expected_check_out } = req.body || {};

  if (!visitor_name || !visitor_email || !host_name || !purpose || !expected_check_out) {
    return res.status(400).json({ message: "Missing required fields" });
  }
const access_code = `HTU-${Date.now().toString().slice(-6)}`;
    await pool.query(   
    "INSERT INTO visits (visitor_name, visitor_email, phone, host_name, purpose, expected_check_out, access_code, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [visitor_name, visitor_email, phone, host_name, purpose, expected_check_out, access_code, 'pending']
    );
    res.status(201).json({ message: "Visit created successfully", access_code });
});
export default router;