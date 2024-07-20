import express from "express";
import {Router} from "express";
import multer from "multer";
import path from "path";

import Blog from "../models/blog.js"
import Comment from "../models/comments.js"
const blogger = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })



blogger.get("/addblog", (req, res) =>{
    // console.log("in addBlog");
    return res.render("addBlog", {
        user:req.user,
    });
})

blogger.get("/:id", async (req, res) =>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  // console.log("blog : ",blog);
  const comment = await Comment.find({blogId: req.params.id}).populate("createdBy");
  // console.log("comments : ", comment)
  res.render("blog", {
      blogs:blog,
      user: req.user,
      comments: comment,
  })
}) 


blogger.post("/", upload.single("coverImageURL"),  async (req, res) => {
  const { title, body} = req.body;
  
  // Log the incoming request body
  // console.log('Request body:', req.body);
  // console.log('Request file:', req.file);

  // Validate required fields
  if (!title || !body) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).send('Error creating blog');
  }
});

blogger.post("/comment/:blogId", async (req, res) =>{
  await Comment.create({
    content: req.body.content, 
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  await Comment.find({blogId: req.params.blogId}).populate("createdBy");
  return res.redirect(`/blog/${req.params.blogId}`)
})


export default blogger;