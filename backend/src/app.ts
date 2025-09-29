import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { kesehatanRoutes } from "./routes/kesehatanRoutes";
import { authRoutes } from "./routes/authRoutes";
import { produkRoutes } from "./routes/produkRoutes";
import { pesananRoutes } from "./routes/pesananRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { stokRoutes } from "./routes/stokRoutes";
import { pesananAdminRoutes } from "./routes/pesananAdminRoutes";
import { ensureStorage, storageRoot } from "./config/storage";
import { pembayaranRoutes } from "./routes/pembayaranRoutes";
import { riwayatAdminRoutes } from "./routes/riwayatAdminRoutes";

export function buatApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  ensureStorage();
  app.use("/static", express.static(storageRoot)); // serve /storage sebagai /static

  app.use("/api", kesehatanRoutes);
  app.use("/api", authRoutes);
  app.use("/api", produkRoutes);
  app.use("/api", pesananRoutes);
  app.use("/api", stokRoutes);
  app.use("/api", pesananAdminRoutes);
  app.use("/api", pembayaranRoutes);
  app.use("/api", riwayatAdminRoutes);

  app.use(errorHandler);
  return app;
}
