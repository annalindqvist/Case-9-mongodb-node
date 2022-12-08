import dotenv from 'dotenv';

// read .env content into variable config
const config = dotenv.config().parsed;

// individual exports
const PORT = Number(config.PORT);
const SESSION_SECRET = config.SESSION_SECRET;
const SESSION_MAXAGE = Number(config.SESSION_MAXAGE); 
const MONGODB_URL = config.MONGODB_URL;
const MONGODB_NAME = config.MONGODB_NAME;

export { config, PORT, SESSION_SECRET, SESSION_MAXAGE, MONGODB_URL, MONGODB_NAME };