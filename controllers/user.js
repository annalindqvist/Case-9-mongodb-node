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
    
    try {
        // FLASH FUNKAR INTE, but why?
        req.flash('error', 'Successfully logged out!')
        req.session.destroy();
        
    } catch (err) {
        console.log(err)
        // FLASH FUNKAR INTE, but why?
        req.flash('error', 'Failed to logged out')
        
    } finally {
        
        res.redirect('/start');
    }
}

async function addUser(req, res) {

    // default endpoint is sign-in page/login/startpage if no erore occurs then stay on sign-up page
    let url = '';
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

        // if username is alreasy taken therow error
        if (userExists) {
            url = 'sign-up';
            throw new Error('username is already taken');

        } else {
            // if password-fields doesnt match theow error
            if (password !== passwordAgain) {
                url = 'sign-up';
                throw new Error("Passwords doesn't match");
            } else {

                // create user document instance locally - should it be named userDoc ? in db it says document..?
                const user = new UserModel({
                    name,
                    username,
                    email,
                    password
                })

                // save to database
                await user.save()
                
                // create flash message - successull
                req.flash('success', 'Successfully added user');
            }
        }

    } catch (err) {
        // create unsuccessfull flash message
        req.flash('error', err.message);
        // if error occurs - stay on sign-up page
        url = 'sign-up';
    } finally {
        res.redirect(`/${url}`);
    }

}

async function signInUser(req, res) {

    // end destination should be dashboard if no errors occcurs
    let url = 'dashboard';

    try {
        const {
            username,
            password
        } = req.body;

        //check if user exists in db
        const user = await UserModel.findOne({
            username
        });

        if (!user) {
            url = '';
            throw new Error('Please try again');
        }

        // match password from form with hashed password in db
        const isAuth = await user.matchPassword(password, user.password);

        // if password doesnt match - throw error, stay on sign-up page/start page/log inpage
        if (!isAuth) {
            url = '';
            throw new Error('Please try again');

        } else {
            // if user exists and password matches save in req.session
            req.session.isAuth = true;
            req.session.userId = user._id;
            req.session.username = username;
            req.session.name = user.name;
            // create success flash message - shows on dashboard when signed in!
            req.flash('success', 'Successfully signed in')
        }

    } catch (err) {
        // if error - create flash message 
        req.flash('Error', err.message)
        url = '';
    } finally {
        // redirect to url that has been declared - if no errors / dashboard,  if errors /sign-in
        res.redirect(`/${url}`);
    }

}


export default {
    getSignIn,
    getSignUp,
    addUser,
    signInUser,
    signOutUser
};