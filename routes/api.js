const apiRouter = require("express").Router();
const fs = require("fs");
const dataPath = "./data/data.json";

apiRouter.get("/", (_, res) => {
  res.json({ message: "ok" });
});

apiRouter.get("/recipes", (req, res) => {
  let query = req.query.exclude_ingredients;
  let excludedIngredientsList = query.split(",");
  console.log(excludedIngredientsList);

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    res.status(200).send({ recipes: JSON.parse(data) });
  });
});

apiRouter.all("*", (_, res) => {
  res.status(404).send({ message: "Invalid url" });
});

module.exports = apiRouter;
