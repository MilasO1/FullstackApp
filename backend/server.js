import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import Op from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import "express-async-errors";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.log(error);
})

try {
    await Op.authenticate();
    console.log("MYSQL connected");
} catch (error) {
    console.log(error);
}

app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({ error: error.message });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
});