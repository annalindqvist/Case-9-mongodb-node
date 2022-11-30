import { Router } from "express";

import UserController from "../controllers/user.js";
import DashboardController from "../controllers/dashboard.js";


const PostsRouter = Router();

function checkIfAuth(req, res, next) {
    if(req.session.isAuth) {
        console.log("user is authenticated");
        next();
    } else {
        console.log("User is NOT authenticated")
        const query = (new URLSearchParams({
            type: "fail",
            message: "You must log in to access content"
        })).toString();
        res.redirect(`/?${query}`);
    }
}

// if not auth (logged in) you dont access posts
PostsRouter.use(checkIfAuth);

PostsRouter.get("/dashboard", DashboardController.getDashboard);
// all concerning profile in one controlleR???? not DashboardController..
PostsRouter.get("/profile", DashboardController.getProfile);
PostsRouter.post("/share-post", DashboardController.addPost);
PostsRouter.delete("/profile/:id", DashboardController.deletePost);

export default PostsRouter;