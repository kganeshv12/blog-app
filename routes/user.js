import express from "express";
import {Router} from "express";

import User from "../models/user.js"

const router = Router();

router.get("/signin", (req, res) =>{
    return res.render("signin");
})

router.get("/signup", (req, res) =>{
    return res.render("signup");
})

// router.post("/signup", async (req, res) =>{
//     const {fullName, email, password} = req.body;
//     await User.create({
//         fullName,
//         email,
//         password,
//     })
//     return res.redirect("/");
// })

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
  
    // Log the incoming request body
    // console.log('Request body:', req.body);
  
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).send('Missing required fields');
    }
  
    try {
      await User.create({
        fullName,
        email,
        password,
      });
      return res.redirect("/");
    } catch (error) {
      console.error('Error saving user:', error);
      return res.status(500).send('Error creating user');
    }
  });

router.post("/signin", async (req, res) =>{
    const {email ,password} = req.body;
    try {
      const token = await User.matchPasswordAndGenerateToken(email, password)
      // console.log(token)
      return res.cookie("token", token).redirect("/");
    } catch (error) {
      console.log("error in routes.user.js is : ", error);
      return res.render("signin", {
        error: "incorrect email or password!"
      });
    }
})

router.get("/logout", (req, res)=>{
  res.clearCookie("token").redirect("/user/signin");
})


export default router;