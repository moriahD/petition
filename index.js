const express = require("express");
const app = express();
const db = require("./utils/db");

app.use(express.static("./public"));
//
//
app.get("/cities", (req, res) => {
    db.getCities().then(results => {
        console.log("results from db.getCities: ", results.rows);
    });
});

app.post("/add-city", (req, res) => {
    //we want to add Munich, DE to our cities table
    //we'll have to write the query in our db.js file and then we'll run it in the POST /add-city route
    db.addCity("Munich", "DE")
        .then(() => {
            console.log("it worked...");
        })
        .catch(err => {
            console.log("err in addCity: ", err);
        });
});
app.listen(8080, () => console.log("i'm listening"));
