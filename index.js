var express = require("express")
var app = express()
var path = require("path")
var bodyparser = require("body-parser")
var { Head } = require("./databases/mongo")
var { getAllCountries, addNewCountry, removeCountry, editCountry, getAllCities, removeCity, editCity, addNewCity } = require("./databases/mysql")

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/pages"))

//getting homepage
app.get("/", (req, res) => {
    res.render("./homepage.ejs");
})

//getting page called /countries/all
app.get("/countries/all", async (req, res) => {
    var countries = await getAllCountries();

    res.render("./countries.ejs", { data: countries })
})
//output
app.post("/countries", async (req, res) => {
    try {
        var result = await addNewCountry(req.body.code, req.body.name, req.body.details)
        res.sendStatus(200);
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})
//deleting countries
app.delete("/countries", async (req, res) => {
    try {
        var result = await removeCountry(req.body.code);

        res.sendStatus(200)
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})
//updating countries
app.post("/countries/update", async (req, res) => {
    try {
        var result = await editCountry(req.body.code, req.body.name, req.body.details);

        res.sendStatus(200)
    } catch (err) {

        console.log(err);
        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

//Cities part
//getting page called /cities/all
app.get("/cities/all", async (req, res) => {
    var cities = await getAllCities();
    var countries = await getAllCountries();

    res.render("./cities.ejs", { data: cities, countries: countries })
})
//deleting cities
app.delete("/cities", async (req, res) => {
    try {
        var result = await removeCity(req.body.code);

        res.sendStatus(200)
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})
//updating cities
app.post("/cities/update", async (req, res) => {
    try {
        var result = await editCity(req.body.code, req.body.name, req.body.population, req.body.coastal, req.body.area);

        res.sendStatus(200)
    } catch (err) {
        console.log(err);
        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})

app.post("/cities", async (req, res) => {
    try {
        var result = await addNewCity(req.body.code, req.body.countrycode, req.body.name, req.body.population, req.body.coastal, req.body.area)

        res.sendStatus(200);
    } catch (err) {
        console.log(err);

        res.status(400).send(err.sqlMessage || "Error 😔")
    }
})
//getting headsofState db
app.get("/heads/all", async (req, res) => {
    try {
        var result = await Head.find();
        var countries = await getAllCountries()

        res.render("./heads.ejs", { data: result, countries: countries })
    } catch (error) {
        console.log(error);
    }
})

app.post("/heads", async (req, res) => {
    try {
        // Update one if exists, create if it doesn't
        await Head.findOneAndUpdate({ _id: req.body._id }, {headOfState: req.body.headOfState}, {upsert: true, new: true})

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(400)
    }
})
//deleting in headsofState
app.delete("/heads", async (req, res) => {
    try {
        await Head.findOneAndDelete({ _id: req.body.code })

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(400)
    }
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})
