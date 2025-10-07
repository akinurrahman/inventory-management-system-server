import "dotenv/config";
import connect from "../config/connect";
import * as authService from "../services/auth.services";

async function seedAdmin() {
  try {
    await connect();
    await authService.createAdmin({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "admin123",
    });
    console.log("Admin user seeded successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error seeding admin user:", error.message);
    } else {
      console.error("Error seeding admin user:", error);
    }
  } finally {
    process.exit(0);
  }
}

seedAdmin();
