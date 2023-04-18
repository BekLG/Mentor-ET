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


const articleSchema= new mongoose.Schema({
    title: String,
    fields: [String],
    content: String,
    author: String,
    date: Date
});

const Article= new mongoose.model("article", articleSchema);




app.get("/", function(req,res){
        res.send("home page")
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
    Article.find({})
    .then((foundArticle)=>{
        res.send(foundArticle)
    })
    .catch((err)=>{
        console.log(err);
    })
})


app.listen(3000, function(req,res){
    console.log("server is up and running on port 3000");
})