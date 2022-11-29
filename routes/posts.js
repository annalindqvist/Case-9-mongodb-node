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

PostsRouter.use(checkIfAuth);
PostsRouter.get("/dashboard", DashboardController.getDashboard);

export default PostsRouter;