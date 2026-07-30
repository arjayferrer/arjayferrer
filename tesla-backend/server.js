import express from "express";
import dotenv from "dotenv";
import teslaRoutes from "./routes/tesla.js";

dotenv.config();

const app = express();
app.use(express.json());

// Serves the Tesla-required public key at:
// https://arjayferrer.com/.well-known/appspecific/com.tesla.3p.public-key.pem
app.use("/.well-known", express.static("./.well-known"));

app.use("/api/tesla", teslaRoutes);

app.get("/api/tesla/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Tesla bridge backend running on :${port}`));
