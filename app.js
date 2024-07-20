import 'dotenv/config'

import express from 'express';
import * as  path from 'path';
import router from './routes/user.js'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import checkForAuthenticationCookie from "./middlewares/authentication.js";
import cookieParser from "cookie-parser";
import blogger from './routes/blog.js';
import Blog from './models/blog.js';

const userRoute = router;
const bloggerRoute = blogger;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve("./public")));

app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(process.env.MONGO_URL)
.then((e)=>{console.log("Mongo Atlas Connected")})

app.set("view engine","ejs" )
app.set("views", path.resolve("./views"))

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req,res)=>{
    const allBlogs = await Blog.find({});
    console.log("hi");
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
})

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`)
})

app.use("/user", userRoute);
app.use("/blog", bloggerRoute);

