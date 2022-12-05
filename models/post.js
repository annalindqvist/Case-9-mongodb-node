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

const postSchema = new Schema({
    post: {
        type: String,
        required: "post must be filled in",
        minlength: 1,
        maxlength: 1000,
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    name: {
        type: String,
        minlength: 1,
        maxlength: 15, 
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Comment'
        }
    ]
},{
    timestamps: true
    
})

const PostModel = mongoose.model('Post', postSchema);

export default PostModel;