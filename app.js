require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const content = require(__dirname + "/modules/content.js");
const _ = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + '/modules/date.js');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let title = "";

async function connectToDb() {
  await mongoose
    .connect(
      process.env.DB_URL,
      { family: 4 }
    )
    .then(function () {
      console.log("connected");
    }).catch(e => {
        console.log(e);
    });
}

connectToDb();

const blogPostSchema = mongoose.Schema({
  title: String,
  content: String,
});

const BlogPost = mongoose.model("post", blogPostSchema);

app.get("/", function (req, res) {
  BlogPost.find().then((blogPosts) => {
    title = "HOME";
    res.render("home", {
      pageTitle:"Home",
      title: title,
      homeContent: content.homeContent,
      articles: blogPosts,
      year: date.year(),
    });
  });
});

app.get("/about", function (req, res) {
  title = "ABOUT";
  res.render("about", {pageTitle:"About US", title: title, about: content.about,year: date.year(), });
});
app.get("/contactMe", function (req, res) {
  title = "REACH ME";
  res.render("contactMe", {pageTitle:"Reach me", title: title, contanctMe: content.contact,year: date.year(), });
});

app.get("/compose", function (req, res) {
  res.render("compose", { pageTitle:"compose",title: "Compose Article",year: date.year(), });
});
app.post("/compose", function (req, res) {
  let article = BlogPost({
    title: req.body.title,
    content: req.body.editorContent,
  });
console.log(req.body);
  article.save().then(() => {
    res.redirect("/");
  });
});

app.get("/post/:id", function (req, res) {
  let requestPostId = req.params.id;
  let id = _.lowerCase(requestPostId);


  
  BlogPost.findById(requestPostId)
    .exec()
    .then((document) => {
      res.render("post", { pageTitle:"artlicle",title: document.title, content: document.content,year:date.year()});
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("listen to port 3000");
});
