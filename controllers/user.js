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
        const {
            username,
            password
        } = req.body;

        const userExists = await UserModel.findOne({username});
        if (userExists) {

            return query = new URLSearchParams({
                type: "error",
                message: "Username already taken"
            });

        } else {

            // create user document instance locally
            const user = new UserModel({
                username,
                password
            })
            
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
        // const queryStr = query.toString();
        // return res.redirect(`/sign-up?${queryStr}`);
    } finally {
        const queryStr = query.toString();
        res.redirect(`/?${queryStr}`);
    }

}

async function signInUser(req, res) {

    let query = null;

    try {
        const {
            username,
            password
        } = req.body;

        //check if user exists
        const user = await UserModel.findOne({username});
        
        if (!user) {
            return {
                error: "Sign in failed"
            };
        }
        // match password with hashed password in db
        const isAuth = await user.matchPassword(password, user.password);
        console.log("isAuth", isAuth)

        if (!isAuth) {

            query = new URLSearchParams({
                type: "fail",
                message: "Failed to logged in"
            });

        } else {
            req.session.isAuth = true;
            req.session.userId = user._id;
            req.session.username = username;

            query = new URLSearchParams({
                type: "success",
                message: "Successfully logged in!"
            });
        }

    } catch (error) {
        console.error(error);
        query = new URLSearchParams({
            type: "fail",
            message: err.message
        });
    } finally {
        console.log('inloggad nu som', req.sessions)
        const queryStr = query.toString();
        res.redirect(`/dashboard?${queryStr}`)
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