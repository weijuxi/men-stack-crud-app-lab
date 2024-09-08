const dotenv = require("dotenv");
dotenv.config(); 
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Food = require("./models/food.js");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /fruits/new  too add new food into the database
app.get("/foods/new", async (req, res) => {
    res.render("foods/new.ejs");
});

// GET /fruits/:id  to display a specific food in the database
app.get("/foods/:id", async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.render("foods/show.ejs", { food });
});

// GET /fruits  to display all the food in the database
app.get("/foods", async (req, res) => {
    const allFoods = await Food.find();
    res.render("foods/index.ejs", { foods: allFoods });
});

// POST /fruits  to create a new food in the database
app.post("/foods", async (req, res) => {
    if (!req.body.price) {
        req.body.price = 0;
    }
    await Food.create(req.body);
    res.redirect("/foods/new");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});