import UserModel from "../models/user.js";
import {
    ObjectId
} from "mongodb";

async function addUser(req, res) {
    console.log("test", req.body.username, req.body.password);

    let query = null;

    try {
        // collect data from body
        const {
            username,
            password
        } = req.body;
        //console.log(username, password);

        // create user document instance locally
        const user = new UserModel({
            username,
            password
        })

        // validation
        await user.validate();

        //console.log(user)
        // save to database
        user.save();
        // create message that operation was successull
        query = new URLSearchParams({
            type: "success",
            message: "Successfully created quote!"
        });
    } catch (err) {
        // create unsuccessfull message
        query = new URLSearchParams({
            type: "fail",
            message: err.message
        });
        console.error(err.message);
    } finally {
        const queryStr = query.toString();
        res.redirect(`/?${queryStr}`);
    }

}

async function signInUser(obj) {
    //check if user exists
    const user = await getUsername(obj.username);
    if (!user) {
        return {error: "Sign in failed"};
    } 

    // hash obj.password to compare with hashed password in db
    const matchPassword = bcrypt.compareSync(obj.password, user.password); 

    if (!matchPassword) {
        return {error: "Login misslyckades"};
    } else {
        return {result: "success", message: "Password match", user: user}
    }

}


async function getUsername(username) {
    return await db.collection("users").findOne({username: username});
};

export default {
    addUser, 
    signInUser
};