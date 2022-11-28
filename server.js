import express from 'express';
import UserRouter from './routes/user.js';

const app = express();

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get('/', function (req, res) {
    res.render('start')
});

app.use(UserRouter);

app.listen(3000, function () {
console.log("Listening on 3000");
});