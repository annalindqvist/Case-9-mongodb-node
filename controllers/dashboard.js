import PostModel from "../models/post.js";
import CommentModel from "../models/comment.js";
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
        console.log("kom även till getProfile")
        res.render("profile", locals);

    }
}


async function getDashboard (req, res) {
    let locals = {};

    try {
        const publicPosts = await PostModel.find({visibility: "public"})
        .populate("postedBy", "username")
        .exec();

        

        console.log(publicPosts)
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

// flashmessage doesnt show because getProfile function also runs - there is two redirects so the flashmessage disapers!
// but why doesn't it happen when adding a new post.....?
async function deletePost (req, res) {

    try {
        const {id} = req.params;
        //console.log(id)

        const deletedPost = await PostModel.deleteOne({_id: id})
        if (deletedPost.deletedCount == 0){
            throw new Error('No post deleted');
        } 
        req.flash('sucess', 'Successfully deleted post!');
        console.log("console efter flash")
        
            
    } catch (err) {
        console.error(err);

        req.flash('error', err.message);
    } finally {
        //console.log("finally");
        //console.log(req.session)
       
        res.redirect('/profile');
    }
}

// same here as deletePost - two redirects so flashmessage disapers.. 
async function updatePost(req, res) {

    try {
        const {id} = req.params;
        const {post, visibility} = req.body;
        
        await PostModel.updateOne(
            {_id: ObjectId(id)},
            {post, visibility}
        )
        req.flash('sucess', 'Successfully updated post!'); 
        
    } catch (err) {

        req.flash('error', 'Someting went wrong');
    } finally {

        res.redirect('/profile');
    }
}

async function addComment(req, res) {

    try {
        // console.log(req.body)
        // console.log(req.session.username)
        const { comment } = req.body;
        const { id } = req.params;
        const postedBy = req.session.userId;

        const commentDoc = new CommentModel({comment, postedBy, post: id});
        await commentDoc.save();

        await PostModel.findOneAndUpdate({_id: ObjectId(id)}, {$push: {"comments": commentDoc}});

    

    }catch (err){
        console.log(err);
    }
    finally {
        console.log("finally");
    }
}

export default {
    
    getProfile,
    getDashboard,
    addPost,
    deletePost,
    updatePost,
    addComment
}
