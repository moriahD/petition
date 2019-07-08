const express = require("express");
const app = express();
const db = require("./utils/db");
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use("/favicon.ico", (request, response) => response.sendStatus(404));
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(express.static("./public"));
//
//
app.get("/", function(req, res) {
    //send method
    console.log("a GET / happened!");
    res.render("hello", {
        layout: "main",
        title: "Welcome to this petition page"
    });
});
app.post("/", (req, res) => {
    console.log(req.body);
    db.addPetitioner(req.body.firstName, req.body.lastName, req.body.signature)
        .then(results => {
            console.log("results from db.addPetitioner: ", results.rows);
        })
        .catch(err => {
            console.log("err in adding petitioner: ", err);
        });
    res.redirect("/signed");
    console.log("post is happening");
});
app.get("/signed", function(req, res) {
    //send method
    var numSigners;
    db.getNumbers()
        .then(number => {
            numSigners = number.rows[0].count;
            res.render("signed", {
                layout: "main",
                title: "Thank you for signing our petition",
                number: numSigners,
                url: "/signers"
            });
        })
        .catch(err => {
            console.log("err in getting numbers of signers : ", err);
        });
});
app.get("/signers", function(req, res) {
    var signers;
    db.getNames()
        .then(results => {
            signers = results.rows;
            res.render("signers", {
                layout: "main",
                title: "our great signers",
                names: signers
            });
            console.log("this is signers results", signers);
        })
        .catch(err => {
            console.log("err in : ", err);
        });
});

app.listen(8080, () => console.log("i'm listening"));
