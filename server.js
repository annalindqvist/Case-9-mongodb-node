// Import dependencies
import express from 'express';
import session from 'express-session';
import flash  from 'connect-flash';

// Import variables
import { SESSION_SECRET, SESSION_MAXAGE } from "./configs.js";

// Import routes
import UserRouter from './routes/user.js';
import PostsRouter from './routes/posts.js'


const app = express();
app.set('view engine', 'ejs')


// ---- SESSIONS
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
function checkSession(req, res, next) {
    console.log("req.session", req.session);
    next();
}

// use checkSession middleware everywhere
app.use(checkSession);

// ---- FLASH-MESSAGES
app.use(flash());
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    next();
})


app.get('/', function (req, res) {
    res.render('start');
});

// ---- ACCESS PUBLIC FOLDER
app.use(express.static('./public'));

// ---- ROUTES
app.use(UserRouter);
app.use(PostsRouter);

app.listen(3000, function () {
console.log("Listening on 3000");
});