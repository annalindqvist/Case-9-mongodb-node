import dotenv from 'dotenv';

// read .env content into variable config
const config = dotenv.config().parsed;

// individual exports
const SESSION_SECRET = config.SESSION_SECRET;
const SESSION_MAXAGE = Number(config.SESSION_MAXAGE); 
const MONGODB_URL = config.MONGODB_URL;


export { config, SESSION_SECRET, SESSION_MAXAGE, MONGODB_URL };