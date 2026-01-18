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

  await pool.query(`
    INSERT INTO incidents (visit_id, description)
    SELECT v.id, 'Visitor did not check out by expected time'
    FROM visits v
    LEFT JOIN incidents i ON i.visit_id = v.id
    WHERE v.status = 'overdue'
      AND i.id IS NULL
  `);
  console.log("Overdue visits processed successfully.");
}
catch(error){
    console.error("Error processing overdue visits:", error);
}
}
