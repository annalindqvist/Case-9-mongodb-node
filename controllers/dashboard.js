import PostModel from "../models/post.js";
import { ObjectId } from "mongodb";
import { SITE_NAME } from "../configs.js";

async function getProfile(req, res) {
    let locals = {};

    try {
        const {userId} = req.session;
        const userPosts = await PostModel.find({postedBy: Object(userId)});
        //console.log("user posts", userPosts)
        
        locals = {userPosts, site: SITE_NAME, user: req.session.username};
        //console.log(locals)

    } catch (err) {
        console.log(err)

    }finally {
        res.render("profile", locals);

    }
}

async function getDashboard (req, res) {
    let locals = {};

    try {
        const publicPosts = await PostModel.find({visibility: "public"})
        .populate("postedBy", "username")
        .exec();

        locals = {publicPosts, site: SITE_NAME};
        //console.log(locals)

    } catch (err) {
        console.log(err)
    }finally {
        //console.log("finally")
        res.render("dashboard", locals);

    }
}

async function addPost(req, res) {
    

    try {
        const {post, visibility} = req.body;
        //console.log(post, visibility);

        const postedBy = ObjectId(req.session.userId);
        const name = req.session.name;

        const postDoc = new PostModel({post, visibility, name, postedBy})
        await postDoc.save();

        //console.log(postDoc)
        req.flash('sucess', 'Successfully shared post!');

    } catch (err) {
      
        req.flash('error', err.message);
       

    }finally {
        //console.log("finally");
        
        res.redirect('/profile');
    }
}

async function deletePost (req, res) {
   

    try {

        const {id} = req.params;
        //console.log(id)

        const deletedPost = await PostModel.deleteOne({_id: id})
        if (deletedPost.deletedCount == 0){
            throw new Error('No post deleted');
        } else {
            req.flash('sucess', 'Successfully deleted post!');
        }
        
    } catch (err) {
        console.error(err);

        req.flash('error', err.message);
    } finally {
        //console.log("finally");
        console.log(req.session)
       
        res.redirect('/profile');
    }
}

async function updatePost(req, res) {
    let query = null;

    try {

        const {id} = req.params;
        const {post, visibility} = req.body;
        
        await PostModel.updateOne(
            {_id: ObjectId(id)},
            {post, visibility}
        )
        query = new URLSearchParams({type: "success", message: "Successfully updated post!"});

        
    } catch (err) {
        console.error(err);
        query = new URLSearchParams({type: "fail", message: err.message});
    } finally {
        console.log("finally");
        const queryStr = query.toString();

        res.redirect(`/profile?${queryStr}`);
    }
}

export default {
    
    getProfile,
    getDashboard,
    addPost,
    deletePost,
    updatePost
}