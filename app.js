require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
const session = require("express-session");
// const flash = require('express-flash');
const bcrypt= require("bcrypt");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "our little secret to be replaced by dotenv.",
    resave: false,
    saveUninitialized: false
}));

// app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect("mongodb+srv://" + dbUsername + ":" + dbPassword + "@cluster1.8xjo7em.mongodb.net/mentorET", { useNewUrlParser: true });


const mentorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    educationLevel: String,     // degree,masters, undergraduate....
    fieldOfExpertise: String,       //sewyew yatenaw field like computer science, finance, marketing, or any other area of specialization. 
    profession: String, //sewyew currently eyesera yalebet position like accountant, fullstack developer...
    email: String,
    password: String,
    profileCompleted: { type: Boolean, default: false }
});

mentorSchema.plugin(passportLocalMongoose);
mentorSchema.plugin(findOrCreate);

const Mentor = new mongoose.model("mentor", mentorSchema);

passport.use(Mentor.createStrategy());

passport.serializeUser((Mentor, done) => {
    done(null, Mentor.id);
});
passport.deserializeUser((mentorId, done) => {
    Mentor.findById(mentorId)
        .then((Mentor) => {
            done(null, Mentor);
        })
        .catch(err => done(err))
});


const articleSchema = new mongoose.Schema({
    title: String,
    fields: [String],
    content: String,
    author: String,
    motive: String,
    datePublished: String,
    approved: { type: Boolean, default: false }
});

const Article = new mongoose.model("article", articleSchema);

const fieldSchema = new mongoose.Schema({
    name: String,
    category: [String]
});

const Field = new mongoose.model("field", fieldSchema);

const emailSubscriberSchema = new mongoose.Schema({
    email: String,
    comment: String
});

const Email = new mongoose.model("email", emailSubscriberSchema);


const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
  });

const Admin= new mongoose.model("Admins", adminSchema);

app.get("/", function (req, res) {

    Article.find({ approved: true }).limit(3) // select only 3 articles,       selecting criterea will be modified.
        .then((foundArticle) => {
            Field.find({})  //fetch all fields
                .then((foundField) => {
                    res.render("home", { Articles: foundArticle, Fields: foundField, isLoggedIn: req.session.isLoggedIn });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get("/signInUp", function (req, res) {
    // this page will send a page that contains both a signin and signup pages with their forms
    res.render('signInUp', {isLoggedIn: req.session.isLoggedIn});
    // from the sign in and up page there will be two possible post requests /login and /register
})
app.get("/reSignInUp", function (req, res) {
    // this page will send a page that contains both a signin and signup pages with their forms
    res.render('reSignInUp', {isLoggedIn: req.session.isLoggedIn});
    // from the sign in and up page there will be two possible post requests /login and /register
})

app.post("/login", function (req, res) {
    // handle login process here
    const mentor = new Mentor({
        username: req.body.username,
        password: req.body.password
    });
    // app.get("/admin", function (req, res) {
        //     Article.find({ approved: false }) // filter articles that are not approved yet
        //         .then((foundArticle) => {
        
        //             Field.find({})  //fetch all fields
        //                 .then((foundField) => {
        //                     res.render("admin", { Articles: foundArticle, Fields: foundField });
        //                 })
        //                 .catch((err) => {
        //                     console.log(err);
        //                 })
        
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         })
        // })
    req.login(mentor, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate('local', { failureRedirect: '/reSignInUp', failureMessage: true })(req, res, function () {
                req.session.isLoggedIn = true;

                // check if the users profile is completed, if not completed redirect user to complete profile page. if completed redirect user to home page

                Mentor.findOne({ _id: req.user._id })
                    .then((foundMentor) => {
                        if (foundMentor.profileCompleted === false) {
                            res.redirect("/completeProfile");
                        }
                        else {
                            res.redirect("/")
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
        }
    })
})

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });

});


app.post("/register", function (req, res) {
    // handle registration process here

    Mentor.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (!err) {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/completeProfile")
            })
        } else {
            console.log(err);
        }
    })
})

app.get("/completeProfile", function (req, res) {
    // a route to ask the mentor to fill relevant informations about him....after signing up.
    res.render("completeprofile");
})

app.post("/completeProfile", function (req, res) {
    const query = { _id: req.user._id };
    Mentor.findOneAndUpdate(query, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        educationLevel: req.body.educationLevel,
        fieldOfExpertise: req.body.fieldOfExpertise,
        profession: req.body.profession,
        profileCompleted: true
    })
        .then(() => {
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get("/composeArticle", function (req, res) {
    // check if the user is mentor

    Field.find({})  //fetch all fields
        .then((foundField) => {
            res.render("composeArticle", { Fields: foundField, isLoggedIn: req.session.isLoggedIn });
        })
        .catch((err) => {
            console.log(err);
        })
})
app.post("/composeArticle", function (req, res) {
    const currentDate = new Date();
    const authorName = req.user.firstName + " " + req.user.lastName;     // getting looged user's full name

    const article = new Article({
        title: req.body.title,
        fields: req.body.fields,
        content: req.body.content,
        author: authorName,
        motive: req.body.motive,
        datePublished: currentDate
    })

    article.save();

    res.redirect("/");
})

app.get("/articles", function (req, res) {
    Article.find({ approved: true }) // filter articles that are approved by admin from database
        .then((foundArticle) => {

            Field.find({})  //fetch all fields
                .then((foundField) => {
                    res.render("blog", { Articles: foundArticle, Fields: foundField, isLoggedIn: req.session.isLoggedIn });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})


app.get("/articles/:field", function (req, res) {
    const field = req.params.field;

    Article.find({ fields: field, approved: true }) // filter articles with selected fields
        .then((foundArticle) => {

            Field.find({})  //fetch all fields
                .then((foundField) => {
                    res.render("blog", { Articles: foundArticle, Fields: foundField, isLoggedIn: req.session.isLoggedIn });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})
app.get("/articles/read/:articleId", function (req, res) {     //a route for read more, to display the whole article in ine page.
    const articleId = req.params.articleId;
    Article.find({ _id: articleId })
        .then((foundArticle) => {
            res.render("readMore", { article: foundArticle, isLoggedIn: req.session.isLoggedIn });
        })
        .catch((err) => {
            console.log(err);
        })

})app.get("/admin", function (req, res) {
    //     Article.find({ approved: false }) // filter articles that are not approved yet
    //         .then((foundArticle) => {
    
    //             Field.find({})  //fetch all fields
    //                 .then((foundField) => {
    //                     res.render("admin", { Articles: foundArticle, Fields: foundField });
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })
    
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // })

// app.get("/admin", function (req, res) {
//     Article.find({ approved: false }) // filter articles that are not approved yet
//         .then((foundArticle) => {

//             Field.find({})  //fetch all fields
//                 .then((foundField) => {
//                     res.render("admin", { Articles: foundArticle, Fields: foundField });
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })

//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })


app.get("/admin", function(req,res){

    if(req.session.isLoggedIn === true)
    {
        


        Article.find({ approved: false }) // filter articles that are not approved yet
        .then((foundArticle) => {

            Field.find({})  //fetch all fields
                .then((foundField) => {
                    res.render("admin", { Articles: foundArticle, Fields: foundField });
                })
                .catch((err) => {
                    console.log(err);
                })

        })
        .catch((err) => {
            console.log(err);
        })


    }
    else
    {
        res.redirect("/adminLogin");
    }
})

app.post("/admin/approvePost", function (req, res) {
    const query = { _id: req.body.articleId };
    Article.findOneAndUpdate(query, {
        approved: true
    })
        .then(() => {
            res.redirect("/admin");
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/admin/addField", function (req, res) {
    const field = new Field({
        name: req.body.name,
        category: req.body.category
    })
    field.save();
    res.redirect("/admin");
})

app.post("/subscribeEmail", function (req, res) {
    const email = new Email({
        email: req.body.emailAdress,
        comment: req.body.commnet
    })
    email.save();
    res.redirect("/");
})

app.get("/about" ,function(req,res){
    res.render("comingSoon");
})

app.get("/profile" ,function(req,res){
    res.render("comingSoon");
})

app.listen(3000, function (req, res) {
    console.log("server is up and running on port 3000");
})