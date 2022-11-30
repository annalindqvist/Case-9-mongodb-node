import PostModel from "../models/post.js";
import { ObjectId } from "mongodb";
import { SITE_NAME } from "../configs.js";



async function getProfile(req, res) {
    let locals = {};

    try {
        const {userId} = req.session;
        const userPosts = await PostModel.find({postedBy: Object(userId)});
        console.log("user posts", userPosts)
        
        locals = {userPosts, site: SITE_NAME, user: req.session.username};
        console.log(locals)

    } catch (err) {
        console.log(err)
    }finally {
        console.log("finally")
        res.render("profile", locals);

    }
    
}

async function getDashboard (req, res) {
    let locals = {};

    try {
        const publicPosts = await PostModel.find({visibility: "public"}).populate("postedBy", "username").exec();
        console.log("public posts", publicPosts);

        locals = {publicPosts, site: SITE_NAME};
        console.log(locals)

    } catch (err) {
        console.log(err)
    }finally {
        console.log("finally")
        res.render("dashboard", locals);

    }
}

async function addPost(req, res) {
    let query = null;

    try {
        const {post, visibility} = req.body;
        console.log(post, visibility);

        const postedBy = ObjectId(req.session.userId);

        const postDoc = new PostModel({post, visibility, postedBy})
        await postDoc.save();

        query = new URLSearchParams({type: "success", message: "Successfully shared post!"});

    } catch (err) {
        console.error(err);
        query = new URLSearchParams({type: "fail", message: err.message});
        console.log(err.message);

    }finally {
        console.log("finally");
        const queryStr = query.toString();
        res.redirect(`/profile?${queryStr}`);
    }
}

export default {
    
    getProfile,
    getDashboard,
    addPost
}