import PostModel from "../models/post.js";
import CommentModel from "../models/comment.js";
import LikeModel from "../models/like.js";
import {
    ObjectId
} from "mongodb";
import {
    SITE_NAME
} from "../configs.js";

async function getProfile(req, res) {
    let locals = {};

    try {
        const {
            userId
        } = req.session;
        const userPosts = await PostModel.find({
                postedBy: Object(userId)
            })
            .populate([{
                path: "comments",
                populate: {
                    path: 'postedBy',
                    model: 'User'
                }
            }, {
                path: "likes",
                populate: {
                    path: 'likedBy',
                    model: 'User'
                }
            }])
            .exec();
        //console.log("user posts", userPosts)
        console.log("testing", userPosts)

        locals = {
            userPosts,
            site: SITE_NAME,
            user: req.session.username
        };
        //console.log(locals)

    } catch (err) {
        console.log(err)

    } finally {
        console.log("kom även till getProfile")
        res.render("profile", locals);

    }
}


async function getDashboard(req, res) {
    let locals = {};

    try {
        // check this one.. populates everything on the user.. 
        const publicPosts = await PostModel.find({
                visibility: "public"
            })
            .populate([{
                path: "postedBy",
                select: "username"
            }, {
                path: "comments",
                populate: {
                    path: 'postedBy',
                    model: 'User'
                }
            }])
            .exec();

        // console.log(publicPosts[7])
        //console.log("publicPost[7]", publicPosts[7].comments[0].postedBy.username)
        locals = {
            publicPosts,
            site: SITE_NAME
        };

    } catch (err) {
        console.log(err)
    } finally {

        res.render("dashboard", locals);

    }
}

async function addPost(req, res) {


    try {
        const {
            post,
            visibility
        } = req.body;
        //console.log(post, visibility);

        const postedBy = ObjectId(req.session.userId);
        const name = req.session.name;

        const postDoc = new PostModel({
            post,
            visibility,
            name,
            postedBy
        })
        await postDoc.save();

        //console.log(postDoc)
        req.flash('sucess', 'Successfully shared post!');

    } catch (err) {

        req.flash('error', err.message);

    } finally {

        res.redirect('/profile');
    }
}

// flashmessage doesnt show because getProfile function also runs - there is two redirects so the flashmessage disapers!
// but why doesn't it happen when adding a new post.....?
async function deletePost(req, res) {

    try {
        const {
            id
        } = req.params;
        //console.log(id)

        // check if user who posted this is same as the one trying to delete post samt with edit and add..?

        const deletedPost = await PostModel.deleteOne({
            _id: id
        })
        if (deletedPost.deletedCount == 0) {
            throw new Error('No post deleted');
        }
        req.flash('sucess', 'Successfully deleted post!');
        //console.log("console efter flash")


    } catch (err) {
        //console.error(err);
        req.flash('error', err.message);
    } finally {

        res.redirect('/profile');
    }
}

// same here as deletePost - two redirects so flashmessage disapers.. 
async function updatePost(req, res) {

    try {
        const {
            id
        } = req.params;
        const {
            post,
            visibility
        } = req.body;

        await PostModel.updateOne({
            _id: ObjectId(id)
        }, {
            post,
            visibility
        })
        req.flash('sucess', 'Successfully updated post!');

    } catch (err) {

        req.flash('error', 'Someting went wrong');
    } finally {

        res.redirect('/profile');
    }
}

// flash-message when added comment! do i need it?!
async function addComment(req, res) {

    try {
        // get comment, post-id and who posted comment
        const {
            comment
        } = req.body;
        const {
            id
        } = req.params;
        const postedBy = req.session.userId;

        // create commentDocument and go through commentSchema
        const commentDoc = new CommentModel({
            comment,
            postedBy,
            post: id
        });
        // save comment do db - ... yes or no? 
        await commentDoc.save();

        // push to post-comment-array ... yes or no?
        await PostModel.findOneAndUpdate({
            _id: ObjectId(id)
        }, {
            $push: {
                "comments": commentDoc._id
            }
        });

    } catch (err) {
        console.log(err);
    } finally {
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
}

async function likePost(req, res) {
    console.log("likepost funktion")
    try {
        // get comment, post-id and who posted comment
        const {
            id
        } = req.params;
        const likedBy = req.session.userId;

        const findPost = await PostModel.find({
                "_id": id
            })
            .populate("likes")
            .exec()

        console.log("likedby", likedBy)
        const alreadyLike = findPost[0].likes.some(like => like.likedBy == likedBy);
        // works sometimes, not always, why?
        console.log("alreadyLike", alreadyLike);





        if (alreadyLike) {
            // TODO. Delete from likes-collection aswell.. how to? 

            const findLikeId = findPost[0].likes.map(id => id._id);
            const likeId = findLikeId[0];
            console.log("findpodt[0]...", likeId);

            const dislike = await LikeModel.deleteOne({
                _id: likeId,
            });

            if (dislike.deletedCount == 0) {
                console.log("deleted like = 0", dislike)

            } else {

                await PostModel.updateOne({
                    _id: ObjectId(id)
                }, {
                    $inc: {
                        'likeCount': 0 ? 0 : -1
                    },
                    $pull: {
                        'likes': likeId
                    }
                });
                console.log("disliked post")
            }


        } else {

            const likeDoc = new LikeModel({
                like: true,
                likedBy,
                post: id
            });
            await likeDoc.save();

            await PostModel.updateOne({
                _id: ObjectId(id)
            }, {
                $inc: {
                    'likeCount': 1
                },
                $push: {
                    'likes': {
                        _id: likeDoc._id
                    }
                }
            });
            console.log("like post")
        }

    } catch (err) {
        console.log(err);
    } finally {
        console.log("finally - likePost")
        // const backURL = req.header('Referer') || '/';
        // res.redirect(backURL);
    }
}

export default {

    getProfile,
    getDashboard,
    addPost,
    deletePost,
    updatePost,
    addComment,
    likePost
}