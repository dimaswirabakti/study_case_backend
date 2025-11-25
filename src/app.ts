import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import menuRoutes from "./routes/menuRoutes";

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

app.use(cors());
app.use(express.json()); // supaya bisa membaca req.body (JSON)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/menu", menuRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Menu Catalog API is running! Check documentation at /api-docs");
});

export default app;
