import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import { SITE_NAME } from "../configs.js";

async function getSignIn(req, res) {
    res.render("start", {serverMessage: req.query});
}

async function getSignUp(req, res) {
    res.render("sign-up", {serverMessage: req.query, site: SITE_NAME});
}

async function addUser(req, res) {

    let query = null;
    try {

        const userExists = await getUsername(req.body.username);
        if (userExists) {

            return query = new URLSearchParams({
                type: "error",
                message: "Username already taken"
            });

        } else {

            // collect data from body
            const {
                username,
                password
            } = req.body;
            console.log(username, password)

            // create user document instance locally
            const user = new UserModel({
                username,
                password
            })
            console.log("user", user)


            // if no errors - save to database...
            await user.save()
            // create message that operation was successull

            query = new URLSearchParams({
                type: "success",
                message: "Successfully added user!"
            });
        }


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

async function signInUser(req, res) {

    try {
        const {
            username,
            password
        } = req.body;
        //check if user exists
        const user = await getUsername(username);
        console.log("user", user)
        if (!user) {
            return {
                error: "Sign in failed"
            };
        }
        // hash obj.password to compare with hashed password in db
        const matchPassword = bcrypt.compareSync(password, user.password);
        console.log("password", password)
        console.log("user.password", user.password)
        console.log("matchPAssword", matchPassword)

        if (!matchPassword) {
            return {
                error: "Login misslyckades"
            };
        } else {
            return {
                result: "success",
                message: "Password match",
                user: user
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        console.log('inloggad nu som', req.sessions)
        res.redirect('/dashboard')
    }

}


async function getUsername(username) {
    return await UserModel.findOne({
        username: username
    });
};

export default {
    getSignIn,
    getSignUp,
    addUser,
    signInUser
};