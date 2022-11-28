import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    exit
} from "process";

// read from .env file and add to process.env
dotenv.config();

// exit program if no connection string
if (!process.env.MONGO_CONNECTION_STR) {
    console.error("MONGO_CONNECTION_STR is not defined in .env file");
    exit();
}

// Connect to database
mongoose.connect(process.env.MONGO_CONNECTION_STR);

const userSchema = {
    username: {
        type: String,
        required: "username must be filled in",
        minlength: 6,
        maxlength: 12
    },
    password: {
        type: String,
        required: "password must be filled in",
        minlength: 8,
        maxlength: 24
    }
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;