import express from 'express';
import session from 'express-session';

import { config, SITE_NAME, PORT, SESSION_SECRET, SESSION_MAXAGE } from "./configs.js";
import UserRouter from './routes/user.js';
import PostsRouter from './routes/posts.js'


const app = express();

app.set('view engine', 'ejs')

// sessions
// ========================================

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: SESSION_MAXAGE },
    })
);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// check sessions
// make sure using next as 3rd argument
function checkSession(req, res, next) {
    console.log("res.session", req.session);
    next();
}

// use checkSession middleware everywhere
app.use(checkSession);




app.get('/', function (req, res) {
    res.render('start', {site: SITE_NAME});
});

app.use(UserRouter);
app.use(PostsRouter);

app.listen(3000, function () {
console.log("Listening on 3000");
});