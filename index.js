var express = require("express")
var app = express()
var path = require("path")
var bodyparser = require("body-parser")
var { getAllCountries, addNewCountry, removeCountry, editCountry, getAllCities, removeCity, editCity } = require("./databases/mysql")

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/pages"))

app.get("/", (req, res) => {
    res.render("./homepage.ejs");
})

app.get("/countries/all", async (req, res) => {
    var countries = await getAllCountries();

    res.render("./countries.ejs", { data: countries })
})

app.post("/countries", async (req, res) => {
    try {
        var result = await addNewCountry(req.body.code, req.body.name, req.body.details)
        res.sendStatus(200);
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

app.delete("/countries", async (req, res) => {
    try {
        var result = await removeCountry(req.body.code);

        res.sendStatus(200)
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

app.post("/countries/update", async (req, res) => {
    try {
        var result = await editCountry(req.body.code, req.body.name, req.body.details);

        res.sendStatus(200)
    } catch (err) {

        console.log(err);
        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

// Cities part

app.get("/cities/all", async (req, res) => {
    var cities = await getAllCities();

    res.render("./cities.ejs", { data: cities })
})

app.delete("/cities", async (req, res) => {
    try {
        var result = await removeCity(req.body.code);

        res.sendStatus(200)
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

app.post("/cities/update", async (req, res) => {
    try {
        var result = await editCity(req.body.code, req.body.name, req.body.population, req.body.isCoastal, req.body.area);

        res.sendStatus(200)
    } catch (err) {
        console.log(err);
        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})
