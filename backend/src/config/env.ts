import "dotenv/config";

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  dbUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "1d") as string | number,
};

if (!env.dbUrl) {
  console.error("DATABASE_URL belum diatur di .env");
  process.exit(1);
}
