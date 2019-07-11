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
    } else {
        res.redirect("/register");
    }
});
////////////// LOGIN //////////////
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
////////////// REGISTER //////////////
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
                req.session.userId = results.rows[0].id;
                // console.log("ciao, i'm here");
                res.redirect("/profile");
            })
            .catch(err => {
                console.log("err in registering: ", err);
            });
    });

    console.log("post is happening");
});
////////////// USER PROFILE //////////////
app.get("/profile", (req, res) => {
    console.log("a GET for profile/ happened!");
    res.render("profile", {
        layout: "main",
        title: "Now please tell us just a little bit more about yourself."
    });
});
app.post("/profile", (req, res) => {
    db.addProfile(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.userId
    )
        .then(res.redirect("/petition"))
        .catch(err => {
            console.log("err in adding petitioner: ", err);
        });

    console.log("a POST for profile/ happened!");
});

////////////// SIGN THE PETITION //////////////
app.get("/petition", function(req, res) {
    console.log("a GET for petition/ happened!");
    res.render("petition", {
        layout: "main",
        title: "Welcome to this petition page"
    });
});
app.post("/petition", (req, res) => {
    db.addSignature(req.body.signature, req.session.userId)
        .then(results => {
            console.log("results after adding signature", results);
            req.session.signatureId = results.rows[0].id;
            res.redirect("/thankyou");
        })
        .catch(err => {
            console.log("err in adding petitioner: ", err);
        });

    console.log("petition post is happening");
});
////////////// THANKYOU PAGE //////////////
app.get("/thankyou", function(req, res) {
    db.getSignature(req.session.signatureId)
        .then(results => {
            console.log("ciao");
            var imgUrl;
            imgUrl = results.rows[0].signature;
            var name;
            name = results.rows[0].first_name;
            var numSigners;
            db.getNumbers()
                .then(number => {
                    numSigners = number.rows[0].count;
                    res.render("thankyou", {
                        layout: "main",
                        name: name,
                        imgUrl: imgUrl,
                        number: numSigners,
                        url: "/signers"
                    });
                })
                .catch(err => {
                    console.log("err in getting numbers of signers : ", err);
                });
        })
        .catch(err => {
            console.log("err in getting signature img : ", err);
        });
});
////////////// LISTS OF SIGNERS //////////////
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
