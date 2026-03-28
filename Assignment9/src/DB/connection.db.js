import mongoose from "mongoose"
import { DB_URI } from "../../config/config.service.js"
import { UserModel } from "./models/user.model.js";

export const connectDB = async()=>{
    try {
        const databaseConnectionResult = await mongoose.connect(DB_URI);
        await UserModel.syncIndexes()
        //console.log({ databaseConnectionResult });
        console.log("Database connected successfully🚀");
    } catch (error) {
        console.log("Database connection error😒:", error);
    }
}