import express, { Request, Response } from "express";
import cors from "cors";
import config from "config";
import morgan from "morgan";
import helmet from "helmet";
import v1Routes from "./routes/v1";

const app = express();

const origins = config.get<string[]>("FRONTEND_URLS");
const nodeEnv = config.get<string>("NODE_ENV");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (nodeEnv === "development") {
  app.use(morgan("dev"));
} else if (nodeEnv === "production") {
  app.use(morgan("combined"));
}

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

app.use(helmet());

app.use("/api/v1", v1Routes);

app.get("/health", (_req: Request, res: Response) =>
  res.status(200).json({ status: "ok" })
);
export default app;
