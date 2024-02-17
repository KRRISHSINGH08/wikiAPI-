// TODO: Create your own restful API using GET, PUT, PATCH, DELETE //
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

//? //////////////////////////////////// Requests Targeting All Articles ///////////////////////////////////////

//* First import array of objects (data) in db using compass. *//
// GET
//* get the data from the db send to the browser *//
// app.get("/articles", function (req, res) {
//   Article.find({})
//     .then((foundArticles) => {
//       res.send(foundArticles);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
//* POST
//* handle post request without creating frontend(button) using Postman. *//
//* Consider postman like browser window. It will send data to server just like how we send data using input & btns *//
//* Set url, request to post, body to form-endcoded then hit send!. *//
//* Server catches data using post request and save new article in db and send back positive res to postman. *//
// ? Don't remember how it works? watch the video! ||
// app.post("/articles", function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   newArticle
//     .save()
//     .then(() => {
//       //* refresh broswer and a new data will appear  *//
//       //* postman receive *//
//       res.send("Successfully inserted the data");
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

// DELETE
// app.delete("/articles", function (req, res) {
//   Article.deleteMany({})
//     .then(() => {
//       res.send("Successfully deleted all data");
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

//* Chainable route handler - app.route('/articles').get().post().delete() *//

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => {
        //* refresh broswer and a new data will appear *//
        //* postman receive *//
        res.send("Successfully inserted the data");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany({})
      .then(() => {
        res.send("Successfully deleted all data");
      })
      .catch((err) => {
        res.send(err);
      });
  });

//? //////////////////////////////////// Requests Targeting A specific Article ////////////////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    //* take the value from route *//
    Article.find({title: req.params.articleTitle})
      .then((foundArticle) => {
        if(foundArticle) {
            res.send(foundArticle)
        }
        else {
            res.send("No article matching that title was found");
        }
      })
  })
  //! check docs, not working properly! *//
  .put(function (req, res) {
    Article.updateOne({title: req.params.articleTitle},
        // take the value from body key-value
        {title: req.body.title, content: req.body.content},
        {overwrite: true})
      .then(() => {
        res.send("Successfully updated the article")
      })
  })
  .patch(function (req, res) {
    Article.updateOne({title: req.params.articleTitle},
        {$set: req.body})
      .then(() => {
        res.send("Successfully updated the article")
      })
  })
  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle})
    .then(()=>{
        res.send("article deleted successfully")
    })
    .catch((err)=>{
        res.send(err)
    })
  })

  app.listen("3000", () => {
    console.log("server starting at port 3000");
  });
  