import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    exit
} from "process";

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

const commentSchema = new Schema({
    comment: {
        type: String,
        required: "comment must be filled in",
        minlength: 1,
        maxlength: 1000,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})


const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;