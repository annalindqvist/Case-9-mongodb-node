import PostModel from "../models/post.js";
import CommentModel from "../models/comment.js";
import LikeModel from "../models/like.js";
import {
    ObjectId
} from "mongodb";

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
                    path: "postedBy",
                    select: "username"
                },
                {
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
                }
            ])
            .exec();


        locals = {
            userPosts,
            user: req.session.username,
            userName: req.session.username,
            serverMessage: req.query
        };

    } catch (err) {
        console.log(err);

    } finally {
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

        locals = {
            publicPosts,
            user: req.session.name,
            serverMessage: req.query
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

        const postedBy = ObjectId(req.session.userId);
        const name = req.session.name;

        const postDoc = new PostModel({
            post,
            visibility,
            name,
            postedBy
        })
        await postDoc.save();

        req.flash('success', 'Successfully shared post!');

    } catch (err) {

        req.flash('error', err.message);

    } finally {
        res.redirect('dashboard');
    }
}

async function deletePost(req, res) {
    let feedback = {};
    let type = {};
    try {
        const {
            id
        } = req.params;

        // check if user who posted this is same as the one trying to delete post samt with edit and add..?

        const deletedPost = await PostModel.deleteOne({
            _id: id
        })
        if (deletedPost.deletedCount == 0) {
            throw new Error('No post deleted');
        }
        feedback = 'Successfully deleted post!';
        type = 'success';

    } catch (err) {
        feedback = 'Something went wrong.';
        type = 'error';
    } finally {

        res.json({
            message: {
                type,
                feedback
            }
        });
    }
}

async function updatePost(req, res) {
    let feedback = {};
    let type = {};

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
        feedback = 'Successfully updated post!';
        type = 'success';

    } catch (err) {

        feedback = 'Something went wrong.';
        type = 'error';
    } finally {

        res.json({
            message: {
                type,
                feedback
            }
        });
    }
}

async function addComment(req, res) {
    let query = null;
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
            $inc: {
                'commentCount': 1
            },
            $push: {
                "comments": commentDoc._id
            }
        });
        query = new URLSearchParams({type: "success", message: "Successfully added comment!"});
    } catch (err) {
        console.log(err);
        query = new URLSearchParams({type: "fail", message: "Something went wrong"});
    } finally {
        const qStr = query.toString();
        res.redirect(`/dashboard?${qStr}`);
    }
}

async function likePost(req, res) {
    let feedback = {};
    let type = {};
    let like = {};
    try {
        // get comment, post-id and who posted comment
        const {
            id
        } = req.params;
        const likedByUser = req.session.userId;
        // find the post 
        const findPost = await PostModel.find({
                "_id": id
            })
            .populate("likes")
            .exec()
            
        const alreadyLike = findPost[0].likes.some(like => like.likedBy == likedByUser);
        const findLikeId = findPost[0].likes.map(id => id.likedBy == likedByUser);

        if (alreadyLike) {
            let likeId;
            for (let i = 0; i < findLikeId.length; i++) {
                if (findLikeId[i] == true){
                    likeId = findPost[0].likes[i]._id;
                };
            };
            const dislike = await LikeModel.deleteOne({
                _id: likeId,
            });
            if (dislike.deletedCount == 0) {
                feedback = 'No like was removed';
                type = 'error';
                like = 0;
            } else {

                await PostModel.updateOne({
                    _id: ObjectId(id)
                }, {
                    $inc: {
                        'likeCount': -1
                    },
                    $pull: {
                        'likes': likeId
                    }
                });
                feedback = 'Your like was removed.';
                type = 'success';
                like = -1;
            }

        } else {
            const likeDoc = new LikeModel({
                like: true,
                likedBy: likedByUser,
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
            feedback = 'Successfully liked post';
            type = 'success';
            like = 1;
        }

    } catch (err) {
        console.log(err);
    } finally {
       
        res.json({
            message: {
                type,
                feedback,
                like
            }
        });
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