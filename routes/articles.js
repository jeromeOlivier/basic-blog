const express = require("express");
const router = express.Router();
const Article = require("./../models/Article");

// get all articles
router.get("/", (req, res) => res.render("articles/index"));

// open article editor
router.get("/new", (req, res) =>
  res.render("articles/new", { article: new Article() }),
);

// get article by slug
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  // if article is null, redirect to home page
  if (article == null) res.redirect("/");
  // else render the article
  res.render("articles/show.ejs", { article: article });
});

// create new article
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new"),
);

// get previous article before editing it
router.get("/edit/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  res.render("articles/edit", { article: article });
});

// update article
router.put("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  article.title = req.body.title;
  article.description = req.body.description;
  article.main = req.body.main;
  try {
    await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch (err) {
    res.render("articles/edit", { article: article });
  }
});

router.delete("/:slug", async (req, res) => {
  await Article.findOneAndDelete({ slug: req.params.slug });
  res.redirect("/");
});

// helper functions
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    const article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.main = req.body.main;
    try {
      await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      console.log(err);
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
