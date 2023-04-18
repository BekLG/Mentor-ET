require("dotenv").config();
const express = require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const lodash= require("lodash");

const app= express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/mentorET", {useNewUrlParser: true})

const mentorSchema= new mongoose.Schema({
    firstName: String,
    lastName: String,
    educationLevel: String,     // degree,masters, undergraduate....
    fieldOfExpertise: String,       //sewyew yatenaw field like computer science, finance, marketing, or any other area of specialization. 
    profession: String, //sewyew currently eyesera yalebet position like accountant, fullstack developer...
    email: String,
    password: String
});

const Mentor= new mongoose.model("mentor", mentorSchema);

const articleSchema= new mongoose.Schema({
    title: String,
    fields: [String],
    content: String,
    author: String,
    date: Date,
    approved: {type: Boolean, default: false }
});

const Article= new mongoose.model("article", articleSchema);




app.get("/", function(req,res){
        res.send("home page")
})

app.get("/signInUp", function(req,res){
    // this page will send a page that contains both a signin and signup pages with their forms
    res.send("sign in and sign up page");

    // from the sign in and up page there will be two possible post requests /login and /register
})
app.post("/login", function(req,res){
    // handle login process here
})
app.post("/register", function(req,res){
    // handle registration process here
})

app.get("/composeArticle", function(req,res){
    // check if the user is mentor
    res.send("article composing page");

})
app.post("/composeArticle", function(req,res){
    const currentDate = new Date();

    const article= new Article({
        title: req.body.title,
        fields: req.body.fields,
        content: req.body.content,
        author: req.body.author,     // for future author name will be fetched from the user data
        date: currentDate
    })

    article.save();
    res.redirect("/");
})

app.get("/articles",function(req,res){
    Article.find({approved:true}) // filter articles that are approved by admin from database
    .then((foundArticle)=>{
        res.send(foundArticle) //will be rendered
    })
    .catch((err)=>{
        console.log(err);
    })
})



app.listen(3000, function(req,res){
    console.log("server is up and running on port 3000");
})