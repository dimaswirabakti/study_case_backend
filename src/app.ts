import express, { Request, Response } from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes";

const app = express();

app.use(cors());
app.use(express.json()); // supaya bisa membaca req.body (JSON)

app.use("/menu", menuRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Menu Catalog API is running!");
});

export default app;
