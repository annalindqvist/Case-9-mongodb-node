import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    exit
} from "process";

const Schema = mongoose.Schema;

// Read from .env file and add to process.env
dotenv.config();

// Exit program if no connection string
if (!process.env.MONGO_CONNECTION_STR) {
    console.error("MONGO_CONNECTION_STR is not defined in .env file");
    exit();
}

// Connect to database
mongoose.connect(process.env.MONGO_CONNECTION_STR);

const likeSchema = new Schema({
    like: {
        type: Boolean,
        default: false,
    },
    likedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, {
    timestamps: true
})

const LikeModel = mongoose.model('Like', likeSchema);

export default LikeModel;