var express = require("express")
var app = express()
var path = require("path")
var bodyparser = require("body-parser")
var { getAllCountries, addNewCountry } = require("./databases/mysql")

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/pages"))

app.get("/", (req, res) => {
    res.render("./homepage.ejs");
})

app.get("/countries/all", async (req, res) => {
    var cities = await getAllCountries();

    res.render("./countries.ejs", { data: cities })
})

app.post("/countries", async (req, res) => {

    try{
        var result = await addNewCountry(req.body.code, req.body.name, req.body.details)
        res.sendStatus(200);
    } catch( err ){
        console.log(err);

        res.status(400).send("Error :(")
    } 


})

app.listen(3000, () => {
    console.log("Listening on 3000");
})
