import pool from "../config/db.js";

export async function handleOverdueVisits() {
try{   
     await pool.query(`
    UPDATE visits
    SET status = 'overdue'
    WHERE status = 'active'
      AND check_in_time IS NOT NULL
      AND check_out_time IS NULL
      AND expected_check_out < NOW()
  `);

  await pool.query(
    //inserts results from a SELECT query. only if the visit does not have an incident record
    `INSERT INTO incidents (visit_id, description)
   SELECT v.id, 'Visitor did not check out by expected time'
   FROM visits v
   WHERE v.status = 'overdue'
   AND NOT EXISTS (
    SELECT 1
    FROM incidents i
    WHERE i.visit_id = v.id
  `);

  console.log("Overdue visits processed successfully.");
}
catch(error){
    console.error("Error processing overdue visits:", error);
}
}
