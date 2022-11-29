import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    exit
} from "process";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// read from .env file and add to process.env
dotenv.config();

// exit program if no connection string
if (!process.env.MONGO_CONNECTION_STR) {
    console.error("MONGO_CONNECTION_STR is not defined in .env file");
    exit();
}

// Connect to database
mongoose.connect(process.env.MONGO_CONNECTION_STR);

const userSchema = new Schema({
    username: {
        type: String,
        required: "username must be filled in",
        minlength: 6,
        maxlength: 12, 
        unique: true
    },
    password: {
        type: String,
        required: "password must be filled in",
        minlength: 8,
        maxlength: 24
    }
})

userSchema.pre('save', function (next) {
    if (this.password) {
        let salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
})

userSchema.methods.matchPassword = async function(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        throw new Error("Login failed, try again", err);
    }
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;