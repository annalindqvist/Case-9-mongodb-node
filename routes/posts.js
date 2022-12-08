import { Router } from "express";

import UserController from "../controllers/user.js";
import DashboardController from "../controllers/dashboard.js";

const PostsRouter = Router();
function checkIfAuth(req, res, next) {
    if(req.session.isAuth) {
        console.log("user is authenticated");
        next();
    } else {
        req.flash('error', 'You must sign in to access');
        res.redirect('/');
    }
}

// if not auth (logged in) you dont access posts
PostsRouter.use(checkIfAuth);

PostsRouter.get("/dashboard", DashboardController.getDashboard);
// all concerning profile in one controlleR???? not DashboardController..
PostsRouter.get("/profile", DashboardController.getProfile);
PostsRouter.post("/share-post", DashboardController.addPost);
PostsRouter.delete("/profile/:id", DashboardController.deletePost);
PostsRouter.put("/profile/:id", DashboardController.updatePost);

PostsRouter.post("/dashboard/comment/:id", DashboardController.addComment);
PostsRouter.post("/dashboard/like/:id", DashboardController.likePost);

export default PostsRouter;