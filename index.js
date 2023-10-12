import { config } from 'dotenv';
import bodyParser from "body-parser";
import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from 'mongoose-encryption';

config();
const app = express();
const port = 8000;
console.log(process.env.API_KEY);
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

// mongoose connection
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema( {
    email:String,
    password:String
});

// secret is in .env file

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

// to save user email and password in DB when user regsiter 

app.post("/register",(req,res)=>{
    const newUser = new User({
        // username is the same name in the rejister.ejs ihe name in email input
        email:req.body.username,
        password:req.body.password
    });
    newUser.save()
    .then(()=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const pass = req.body.password;

    User.findOne({email:username})
    .then((foundUser)=>{
        if(foundUser.password===pass)
        {
            res.render("submit");
        }
    
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
});