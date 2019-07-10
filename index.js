const express = require("express");
const app = express();

const db = require("./utils/db");
const hb = require("express-handlebars");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const bc = require("./utils/bc");
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
// this means my app is on heroku and my server should look for a cookieSessionSecret on Heroku
// this in general is how we handle secret credentials on Heroku

app.use(
    cookieSession({
        secret: "I'm always angry.",
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
    res.redirect("/register");
});
app.get("/login", function(req, res) {
    res.render("login", {
        title: "Please log in."
    });
    // get info of form
});
app.post("/login", function(req, res) {
    //first check if the user is
    db.getUserId(req.body.email)
        .then(result => {
            if (!result.rows[0]) {
                res.render("login", {
                    error: "Your email does not exist!!! Try again."
                });
            } else {
                return result;
            }
        })
        .then(result => {
            bc.checkPassword(req.body.password, result.rows[0].password)

                .then(results => {
                    if (!results) {
                        console.log("password does not match");
                        res.render("login", {
                            error: "Your password does not match!!! Try again."
                        });
                    } else {
                        res.redirect("/signers");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
});
//post request, deal with password
app.get("/register", function(req, res) {
    res.render("register", {
        title:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    });
});
app.post("/register", (req, res) => {
    bc.hashPassword(req.body.password).then(hashedpw => {
        db.addUser(
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashedpw
        )
            .then(results => {
                console.log(results);
                console.log("ciao, i'm here");
                res.redirect("/petition");
            })
            .catch(err => {
                console.log("err in registering: ", err);
            });
    });

    console.log("post is happening");
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

    db.addSignature(req.body.signature)
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

app.listen(process.env.PORT || 8080, () => console.log("i'm listening"));
