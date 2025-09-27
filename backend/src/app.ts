import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { kesehatanRoutes } from "./routes/kesehatanRoutes";
import { authRoutes } from "./routes/authRoutes";
import { produkRoutes } from "./routes/produkRoutes";
import { pesananRoutes } from "./routes/pesananRoutes";
import { errorHandler } from "./middleware/errorHandler";

export function buatApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api", kesehatanRoutes);
  app.use("/api", authRoutes);
  app.use("/api", produkRoutes);
  app.use("/api", pesananRoutes);

  app.use(errorHandler);
  return app;
}
