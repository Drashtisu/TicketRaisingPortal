import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";

const app = express();



app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Ticket Raising Portal API"
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);



app.use(errorHandler);

export default app;
