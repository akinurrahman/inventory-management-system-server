import "dotenv/config";
import app from "./app";
import connect from "./config/connect";
import config from "config";

const startServer = async () => {
  const port = config.get<Number>("PORT") || 3000;
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
