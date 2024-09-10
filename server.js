const dotenv = require("dotenv");
dotenv.config(); 
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
const path = require("path");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Food = require("./models/food.js");
const authController = require("./controllers/auth.js");

// -------------------Middleware-------------------//

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
//app.use(morgan("dev")); //new
app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", authController);



//-----------------ROUTES-----------------//


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
    res.render("foods/show.ejs", { food: food });
});

//delete route
app.delete("/foods/:id", async (req, res) => {
    const deleteFood = await Food.findByIdAndDelete(req.params.id);
    res.redirect("/foods");
});

// GET /fruits/:id/edit  to display a form to edit a specific food in the database
app.get("/foods/:id/edit", async (req, res) => {
    const foodId = await Food.findById(req.params.id);
    res.render("foods/edit.ejs", { food: foodId });
});

// PUT /fruits/:id  to update a specific food in the database
app.put("/foods/:id", async (req, res) => {
    await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/foods/${req.params.id}`);
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