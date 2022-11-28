import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { exit } from "process";

dotenv.config();

// Setup mongodb Client
if (!process.env.MONGO_CONNECTION_STR) {
    console.error("MONGO_CONNECTION_STR is not defined in .env file");
    exit();
}

const mongoDbClient = new MongoClient(process.env.MONGO_CONNECTION_STR);
let client = null;

async function dbConnect() {
    try {
        if (!client) {
            client = await mongoDbClient.connect();
            console.log("Successfully connected to database");
        }
    } catch (err) {
        console.log(err);
    }

    return client;
}

export default dbConnect;