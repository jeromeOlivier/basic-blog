// purpose: main entry point for the application

// external modules
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
// internal modules
const articles = require("./routes/articles");
const Article = require("./models/Article");

// initialize...
// dotenv
dotenv.config();
// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// express
app.use(express.urlencoded({ extended: false }));
// mongoose
mongoose
  .connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err));
// method-override
app.use(methodOverride("_method"));

// routes
app.use(express.static(path.join(__dirname, "public")));
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", {
    articles: articles,
    title: "Archive",
  });
});
app.use("/articles", articles);

// initialize express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express on port ${PORT}`));
