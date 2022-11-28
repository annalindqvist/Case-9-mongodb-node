import { Router } from "express";
import UserController from "../controllers/user.js";

const UserRouter = Router();

// render startpage/sign-in page
UserRouter.get("/start", (req, res) => {
    res.render("start");
});

// render sign-up page
UserRouter.get("/start/sign-up", (req, res) => {
    res.render("sign-up");
});

// add user to db
UserRouter.post("/start/sign-up", UserController.addUser);

UserRouter.post("/start/sign-in", (req, res) => {
    //console.log("login..", req.body);

     // prepare obj reply
     let reply = {result: "", message: ""};

     // controller method.. 
     UserController.signInUser(req.body).then((data) => {

         console.log("data", data);

         if(data.error) {
            reply.result = "fail";
            reply.message= data.error;
         } else {
             reply.result = "success";
             reply.message = "You signed in";

            //  // session
            //  req.session.username = data.user.username;
         }

     }).catch(error => {
         console.error("error signInUser method", error);
     }).finally(() => {
         res.json(reply);
     })

});



export default UserRouter;