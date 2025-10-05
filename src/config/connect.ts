import config from "config"
import mongoose from "mongoose"

const connect =async ()=>{
    const port = config.get<Number>("PORT")
    const mongoUri = config.get<string>("MONGO_URI")
    try {
        const mongodbInstance = await mongoose.connect(mongoUri);
        console.log(
          `MongoDB connected at port: ${port} \nDB Host: ${mongodbInstance.connection.host} `
        );
    } catch (error) {
        console.error("Could not connect to database", error)
        process.exit(1)
    }
}
export default connect