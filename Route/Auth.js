const express = require("express");
const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken")
const route= express.Router();

const User=require('../models/User.model');

route.post('/register', async (req, res) => {

    try { 
      const username = req.body.Username;
      const email=req.body.Email;
      // Check if user already exists
      const user = await User.findOne({"Email":email});
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      if(req.body.Username.length==0){
        return res.status(400).json({ message: 'Username is empty' });
      }
      if(req.body.Email.length==0){
        return res.status(400).json({ message: 'Email is empty' });
      }
      if(req.body.Password.length==0){
        return res.status(400).json({ message: 'Password is empty' });
      }
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.Password, salt);
      console.log(username,email,req.body.Password,hashedPassword);
  
      // Create new user
      const newUser = new User({
        Username: req.body.Username,
        Email: email,
        Password: hashedPassword
      });
  
      await newUser.save();
      res.status(201).json(
        newUser
      );
    } 
    catch (error) {
      console.error(error); 
      res.status(500).json({ message: 'Server error' });
    }

  });
  
  
  route.post('/login', async (req, res) => {
  
    try { 
     
      const email=req.body.Email;
      const password=req.body.Password;
      // Check if user already exists
      const user = await User.findOne({"Email":email});
      if (user) {
        bcrypt.compare(password,user.Password,(err,result)=>{
           if(!result){
            res.json({ 
              message:"Invalid Password"
            })
          }
          else if(result){
            let token= jwt.sign({ _id: user._id.toString()},'verySecreatValue')
            console.log(result)
            res.json({
              status:"true",
              code:200,
              message:"Logged in successfully",
              token,
              user_id:user._id
            })
          }
        })
       }
      else{
        res.json({
          message:"User not found",
          status:"false",
          code:400
        })
      }
  
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: 'Server error' });
    }
  });

  module.exports=route;