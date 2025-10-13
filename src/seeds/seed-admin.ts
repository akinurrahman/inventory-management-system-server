import "dotenv/config";
import connect from "../config/connect";
import * as authService from "../services/auth.services";
import log from "../utils/logger";

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  try {
    await connect();
    await authService.createAdmin({
      fullName: "Admin User",
      email: adminEmail,
      password: adminPassword,
    });
    log.info("Admin user seeded successfully");
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Error seeding admin user: ${error.message}`);
    } else {
      log.error(`Error seeding admin user: ${error}`);
    }
  } finally {
    process.exit(0);
  }
}

seedAdmin();
