const express = require("express");
const app = express();
const db = require("./utils/db");
const hb = require("express-handlebars");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use("/favicon.ico", (request, response) => response.sendStatus(404));
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
//sudo service postgresql start
app.use(express.static("./public"));
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.use((req, res, next) => {
    if (req.session.signatureId && req.url == "/petition") {
        res.redirect("/thankyou");
    } else {
        next();
    }
});
app.use(csurf());
app.use(function(req, res, next) {
    res.set("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.get("/", function(req, res) {
    if (req.session.signatureId) {
        res.redirect("/thankyou");
    }
    res.redirect("/petition");
});
app.get("/petition", function(req, res) {
    //send method
    console.log("a GET / happened!");
    res.render("petition", {
        layout: "main",
        title: "Welcome to this petition page"
    });
});
app.post("/petition", (req, res) => {
    console.log(req.body);
    db.addPetitioner(req.body.firstName, req.body.lastName, req.body.signature)
        .then(results => {
            req.session.signatureId = results.rows[0].id;
            // console.log("results from db.addPetitioner: ", results.rows);
            res.redirect("/thankyou");
        })
        .catch(err => {
            console.log("err in adding petitioner: ", err);
        });

    console.log("post is happening");
});
app.get("/thankyou", function(req, res) {
    //send method
    db.getImage(req.session.signatureId)
        .then(results => {
            console.log("ciao");
            var imgUrl;
            console.log("this is img url: ", results.rows[0].signature);
            imgUrl = results.rows[0].signature;
            var numSigners;
            db.getNumbers()
                .then(number => {
                    numSigners = number.rows[0].count;
                    res.render("thankyou", {
                        layout: "main",
                        title: "Thank you for signing our petition",
                        imgUrl: imgUrl,
                        number: numSigners,
                        url: "/signers"
                    });
                })
                .catch(err => {
                    console.log("err in getting numbers of signers : ", err);
                });
        })
        .catch();
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
        })
        .catch(err => {
            console.log("err in signers : ", err);
        });
});

app.listen(8080, () => console.log("i'm listening"));
