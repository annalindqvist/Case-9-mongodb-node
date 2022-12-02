import UserModel from "../models/user.js";
import {
    SITE_NAME
} from "../configs.js";





async function getSignIn(req, res) {
    res.render("start", {
        serverMessage: req.query
    });
}

async function getSignUp(req, res) {
    res.render("sign-up", {
        serverMessage: req.query,
        site: SITE_NAME,
    });
}

async function signOutUser(req, res) {
    let query = null;
    try {
        req.session.destroy();
        query = new URLSearchParams({
            type: "success",
            message: "Successfully logged out!"
        });
    } catch (err) {
        console.log(err)
        query = new URLSearchParams({
            type: "fail",
            message: "Failed to logged out!"
        });
    } finally {
        const queryStr = query.toString();
        res.redirect(`/start?${queryStr}`);
    }
}

async function addUser(req, res) {

    //let query = null;
    let url = 'login';
    try {
        const {
            name,
            username,
            email,
            password,
            passwordAgain
        } = req.body;

        console.log(name, username, email, password, passwordAgain)
        const userExists = await UserModel.findOne({
            username
        });
        if (userExists) {
            url = 'sign-up';
            //req.flash('error', 'username is already taken')
            throw new Error('username is already taken');

        } else {

            if (password !== passwordAgain) {
                url = 'sign-up';
                //req.flash('error', 'Passwords doesnt match');
                throw new Error("Passwords doesn't match");
            } else {

                // create user document instance locally
                const user = new UserModel({
                    name,
                    username,
                    email,
                    password
                })

                // if no errors - save to database...
                await user.save()
                
                // create message that operation was successull
                req.flash('sucess', 'Successfully added user');
                // query = new URLSearchParams({
                //     type: "success",
                //     message: "Successfully added user!"
                // });
            }
        }

    } catch (err) {
        // create unsuccessfull message
        req.flash('error', err.message);
        // query = new URLSearchParams({
        //     type: "fail",
        //     message: err.message
        // });
        url = 'sign-up';
        console.error(err.message);
        // const queryStr = query.toString();
        // return res.redirect(`/sign-up?${queryStr}`);
    } finally {

        
        
        // const queryStr = query.toString();
        //res.redirect(`/${url}?${queryStr}`);
        res.redirect(`/${url}`);
        console.log(req.session)
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
        const user = await UserModel.findOne({
            username
        });

        if (!user) {
            return query = new URLSearchParams({
                    type: "fail",
                    message: "Failed to logged in"
                });
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
            req.session.name = user.name;

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
        //console.log('inloggad nu som', req.sessions)
        const queryStr = query.toString();
        res.redirect(`/dashboard?${queryStr}`);
    }

}


// async function getUsername(username) {
//     return await UserModel.findOne({
//         username: username
//     });
// };

export default {
    getSignIn,
    getSignUp,
    addUser,
    signInUser,
    signOutUser
};