import { Router } from "express";
import { SITE_NAME } from "../configs.js";
import UserController from "../controllers/user.js";

const UserRouter = Router();

// render startpage/sign-in page
UserRouter.get("/", UserController.getSignIn);

// sign in user
UserRouter.post("/sign-in", UserController.signInUser);

// get sign-up page
UserRouter.get("/sign-up", UserController.getSignUp);

// add user to db
UserRouter.post("/sign-up", UserController.addUser);

// UserRouter.post("/start/sign-in", (req, res) => {
//     //console.log("login..", req.body);

//      // prepare obj reply
//      let reply = {result: "", message: ""};

//      // controller method.. 
//      UserController.signInUser(req.body).then((data) => {

//          console.log("data", data);

//          if(data.error) {
//             reply.result = "fail";
//             reply.message= data.error;
//          } else {
//              reply.result = "success";
//              reply.message = "You signed in";

//             //  // session
//             //  req.session.username = data.user.username;
//          }

//      }).catch(error => {
//          console.error("error signInUser method", error);
//      }).finally(() => {
//          console.log("test")
//          res.render('start', {site: SITE_NAME})
         
//      })

// });
// UserRouter.post("/start/sign-in", UserController.signInUser(req.body));



export default UserRouter;