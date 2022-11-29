import { Router } from "express";
import UserController from "../controllers/user.js";
import DashboardController from "../controllers/dashboard.js";



const PostsRouter = Router();

PostsRouter.get("/dashboard", DashboardController.getDashboard);

export default PostsRouter;