import express from "express";
import pool from "../config/db.js";
import Auth from "../middleware/auth.middleware.js";
import Roles from "../middleware/role.middleware.js";
import { handleOverdueVisits } from "../utils/overdue.js";
import { sendAccessCodeEmail } from "../email.service.js";

const router = express.Router();

router.post("/visits", Auth, Roles("staff"), async (req, res) => {
    const { visitor_name, visitor_email, phone, host_name, purpose, expected_check_out } = req.body || {};
    if (!visitor_name || !visitor_email || !host_name || !purpose || !expected_check_out) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const access_code = `HTU-${Date.now().toString().slice(-6)}`;
    try{
        await pool.query(   
            "INSERT INTO visits (visitor_name, visitor_email, phone, host_name, purpose, access_code, expected_check_out, status, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())",
            [visitor_name, visitor_email, phone, host_name, purpose, access_code, expected_check_out, 'pending', req.user.id]
        );
        try{
        await sendAccessCodeEmail({
        to: visitor_email,
        visitorName: visitor_name,
        accessCode: access_code,
        hostName: host_name,
        expectedCheckout: expected_check_out,});
    console.log("Access code email sent successfully");    
    }
        catch(err){
            console.error("Error sending email:", err);
        }
        res.status(201).json({ message: "Visit created successfully", access_code });
    }
    catch (error) {
        console.error("Error creating visit:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/visits", Auth, Roles("staff","security"), async (req, res) => {
    const {status} = req.query;
    try{
        await handleOverdueVisits();
    const result = await pool.query
    (`SELECT *
      FROM visits
      ORDER BY created_at DESC
    `); res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching visits:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/incidents", Auth, Roles("staff"), async (req, res) => {
    try{
 const result = await pool.query(`
      SELECT i.id, i.description,i.created_at,
             v.visitor_name, v.host_name, v.access_code, v.purpose
      FROM incidents i
      JOIN visits v ON v.id = i.visit_id
        WHERE v.created_by = $1
      ORDER BY i.created_at DESC
    `, [req.user.id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
