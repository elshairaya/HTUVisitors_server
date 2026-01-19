import pool from "../config/db.js";

const seed = async () => {
  try {
    await pool.query("DELETE FROM incidents");
    await pool.query("DELETE FROM visits");
    await pool.query("DELETE FROM users");

    const usersRes = await pool.query(`
      INSERT INTO users (name, email, username, password, role)
      VALUES
        ('System Administrator', 'admin@htu.edu', 'admin', 'admin123', 'admin'),
import pool from '../config/db.js';
const seed = async () => {
    try {
        await pool.query("DELETE FROM visits");
        await pool.query("DELETE FROM users");
        await pool.query("DELETE FROM incidents");

        const usersRes= await pool.query(`
            INSERT INTO users (name, email, username, password, role) VALUES
            ('System Administrator', 'admin@htu.edu', 'admin', 'admin123', 'admin'),
        ('Sarah Johnson', 'sarah.johnson@htu.edu', 'staff1', 'staff123', 'staff'),
        ('Ahmed Hassan', 'ahmed.hassan@htu.edu', 'security1', 'security123', 'security')
      RETURNING id, role;
    `);

    const staffId = usersRes.rows.find(u => u.role === "staff").id;

    const visitsRes = await pool.query(
      `
      INSERT INTO visits
    const staffId= usersRes.rows.find(user => user.role === 'staff').id;
    const visitsRes= await pool.query(`
            INSERT INTO visits
      (visitor_name, visitor_email, phone, host_name, purpose, access_code, expected_check_out, status, created_by)
      VALUES
      ('Aya Elshair','elshairaya@gmail.com','+96277777777','Dr. Razan','Test','HTU-2024-HOY5','2025-12-08 17:40:00','overdue',$1),
      ('John Smith','john.smith@example.com','+96278888888','Dr. Ahmed Hassan','Research Collaboration','HTU-2024-A1B2','2025-12-08 17:00:00','overdue',$1),
      ('Sarah Johnson','sarah@company.com','+96279999999','Prof. Laila Mansour','Guest Lecture','HTU-2024-C3D4','2025-12-08 14:00:00','completed',$1)
      RETURNING id;
      `,
      [staffId]
    );

    await pool.query(
      `
      INSERT INTO incidents (visit_id, description)
    await pool.query(`
        INSERT INTO incidents (visit_id, description)
      VALUES
      ($1, 'Visitor did not check out by expected time'),
      ($2, 'Visitor did not check out by expected time');
      `,
      [visitsRes.rows[0].id, visitsRes.rows[1].id]
    );

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (e) {
    console.error("Seeding failed:", e.message);
    process.exit(1);
  }
};

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
};
seed();
