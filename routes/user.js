import { Router } from "express";
import UserController from "../controllers/user.js";

const UserRouter = Router();

// render startpage/sign-in page
UserRouter.get("/", UserController.getSignIn);
// sign in user
UserRouter.post("/sign-in", UserController.signInUser);
// sign out user
UserRouter.get("/sign-out", UserController.signOutUser);

// get sign-up page
UserRouter.get("/sign-up", UserController.getSignUp);
// add user to db
UserRouter.post("/sign-up", UserController.addUser);




export default UserRouter;