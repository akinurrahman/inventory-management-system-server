export default {
  PORT: Number(process.env.PORT) || 8000,
  MONGO_URI: process.env.MONGO_URI || "",
  saltWorkFactor: 10,
  smtpEmail: process.env.SMTP_EMAIL || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URLS: process.env.FRONTEND_URLS
    ? JSON.parse(process.env.FRONTEND_URLS)
    : [],
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,

  CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
  CLOUD_FOLDER: process.env.NODE_ENV === "production" ? "ims" : "ims_dev"
};
