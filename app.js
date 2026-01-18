import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import securityRoutes from "./routes/security.routes.js";
const app=express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.json({ status: "OK", message: "Backend running" }));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/staff", staffRoutes);
app.use("/security", securityRoutes);

export default app;