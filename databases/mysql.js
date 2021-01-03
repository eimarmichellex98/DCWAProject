var mysql = require("mysql")
var settings = require("./settings.json")

// we create a connection here
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: settings.user,
    password: settings.password,
    database: "geography"
})

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database!");
    }
})

// this is an async implementation of quering the database for all of the records of the countries
function getAllCountries() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from country', function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results)
            }
        })
    })
}

function getAllCities() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from city', function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results)
            }
        })
    })
}

function addNewCountry(code, name, desc) {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO country VALUES(?, ?, ?)", [code, name, desc], function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

function removeCountry(code) {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM country WHERE co_code = ?", [code], function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

function editCountry(code, name, details) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE country SET co_name = ?, co_details = ? WHERE co_code = ?", [name, details, code], function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

function editCity(code, name, population, isCoastal, area) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE city SET cty_name = ?, population = ?, isCoastal = ?, areaKM = ? WHERE co_code = ?", [name, population, isCoastal ? 'true' : 'false', area, code], function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

module.exports.editCity = editCity
module.exports.editCountry = editCountry
module.exports.getAllCountries = getAllCountries
module.exports.getAllCities = getAllCities
module.exports.addNewCountry = addNewCountry;
module.exports.removeCountry = removeCountry;