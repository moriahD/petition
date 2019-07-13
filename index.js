const express = require("express");
const app = (exports.app = express());

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
app.use((req, res, next) => {
    if (!req.session.userId && req.url != "/register" && req.url != "/login") {
        res.redirect("/register");
        res.locals.on = true;
    } else {
        next();
    }
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
        main_text: "Please log in."
    });
    // get info of form
});
app.post("/login", function(req, res) {
    //first check if the user is
    db.getUserId(req.body.email)
        .then(result => {
            if (!result.rows[0]) {
                res.render("login", {
                    error: "Something is wrong! Please try to type carefully."
                });
            } else {
                req.session.userId = result.rows[0].id;
                console.log("id", req.session.userId);
                return result;
            }
        })
        .then(result => {
            bc.checkPassword(req.body.password, result.rows[0].password)
                .then(results => {
                    if (!results) {
                        res.render("login", {
                            error: "Oops, wrong password! Try again."
                        });
                    } else {
                        db.getSigByUserId(req.session.userId).then(result => {
                            // console.log(
                            //     "getsigbyuserid result: ",
                            //     result.rows[0].signature
                            // );
                            if (result.rows[0].signature) {
                                req.session.signatureId = true;
                                res.redirect("/thankyou");
                            } else {
                                res.redirect("/petition");
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
});
////////////// REGISTER //////////////
app.get("/register", function(req, res) {
    res.render("register");
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
        main_text: "Now please tell us just a little bit more about yourself."
    });
});
app.post("/profile", (req, res) => {
    let url;
    if (!req.body.url.startsWith("http")) {
        url = "http://" + req.body.url;
    } else if (req.body.url.startsWith("http")) {
        url = req.body.url;
    } else if (req.body.url.contains("=" || "'" || ";")) {
        !url;
    } else if (req.body.url == "") {
        !url;
    }

    db.addProfile(req.body.age, req.body.city, url, req.session.userId)
        .then(res.redirect("/petition"))
        .catch(err => {
            console.log("err in adding profile: ", err);
        });

    console.log("a POST for profile/ happened!");
});
////////////// PROFILE EDIT //////////////
// app.get("/profile/edit", (req, res) => {
//
// });
// app.post("/profile/edit", (req, res) => {
//
// });
////////////// DELETE SIGNATURE ////////////////

////////////// LOG OUT //////////////
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

////////////// SIGN THE PETITION //////////////
app.get("/petition", function(req, res) {
    console.log(req.session);
    if (req.session.signatureId) {
        res.redirect("/thankyou");
    } else {
        console.log("a GET for petition/ happened!");
        res.render("petition", {
            layout: "main",
            main_text: "Welcome to this petition page"
        });
    }
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
    console.log("req.session.userId", req.session.userId);
    console.log("req.session.signatureId", req.session.signatureId);
    db.getSignerName(req.session.userId)
        .then(results => {
            var imgUrl = results.rows[0].signature;
            var first_name = results.rows[0].first_name;
            var numSigners;
            db.getAllProfile()
                .then(results => {
                    console.log("numbers results: ", results);
                    numSigners = results.rowCount;
                    res.render("thankyou", {
                        layout: "main",
                        first_name: first_name,
                        imgUrl: imgUrl,
                        number: numSigners,
                        url: "/signers",
                        delete: "Delete Your Signature"
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
    db.getAllProfile()
        .then(results => {
            signers = results.rows;
            console.log("signers row: ", results.rows);
            res.render("signers", {
                layout: "main",
                main_text: "our great signers",
                signers: signers
            });
        })
        .catch(err => {
            console.log("err in signers : ", err);
        });
});
/////////// LISTS OF SIGNERS BY CITY ///////////
app.get("/petition/signers/:byCity", function(req, res) {
    db.getSignersByCity(req.params.byCity)
        .then(result => {
            console.log("result by city: ", result);
            var signers = result.rows;
            res.render("city", {
                layout: "main",
                signers: signers
            });
        })
        .catch(err => {
            console.log("err in getting signers sorted by city : ", err);
        });
});
//////////////SUPER TEST/////////////////////
app.get("/home", (req, res) => {
    res.send("hi, welcome");
});
app.get("/product", (req, res) => {
    res.send(`
        <html>
            <h1></h1>
            <form method='POST'>
                <button></button>
                <input type='hidden' name='_csrf' value="${req.csrfToken()}">
            </form>
        </html>
        `);
});
app.post("/product", (req, res) => {
    req.session.wouldLikeToBuy = true;
    req.session.puppy = "Layla";
    res.redirect("/home");
});
// //////////////SUPER TEST/////////////////////

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("i'm listening"));
}
