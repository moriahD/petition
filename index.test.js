const { app } = require("./index");
const supertest = require("supertest");
const cookieSession = require("cookie-session"); //importing cookie session from mocks folder, we're require the cookieSession mock, not the NPM module cookie-session!

console.log("app: ", app);
//first arg: string to describe a test and the function as second arg
test("GET /home returns an h1 as reponse", () => {
    return supertest(app)
        .get("/home")
        .then(res => {
            expect(res.statusCode).toBe(200);
            //OPTION 1 for checking HTML of response
            // expect(res.text).toBe('<h1>hi, welcome</h1>') or

            //OPTION 2 for checking HTML of response
            expect(res.text).toContain("welcome");
        });
});

//how to run the TEST
//type npm test in command line and wait
// text, header, status code are 3 things we must check

//if you want to check if you get a certan DOM node with a class on it...
//look up "cheerio"

test("POST /product redirects to /home", () => {
    return (
        supertest(app)
            .post("/product")
            //handling user input in a test
            // .send(
            //     "first=testFristName&last=testLastName&email=test@test&password=myTestpassword"
            // ) //name of input field
            .then(res => {
                console.log("res: ", res);
                expect(res.statusCode).toBe(302);
                expect(res.text).toContain("Found");
                expect(res.headers.location).toBe("/home");
            })
    );
});

//test cookieSession
test("POST /product sets req.session.wouldLikeToBuy to true", () => {
    //step 1: create cookie
    let cookie = {};

    //step 2: tell cookieSession mock that the "cookie" variable is our cookie, and any time a user writes data to a cookie, it should be placed in the "cookie variable"
    cookieSession.mockSessionOnce(cookie); // tell my cookie session mock to treat cookie variable as cookie.

    //step 3: now make super test post request.
    return supertest(app)
        .post("/product")
        .then(res => {
            // the cookie variable is our cookie. It contains all the data our server wrote to the cookie in the specific route that we're testing
            console.log("cookie: ", cookie);
            expect(cookie.wouldLikeToBuy).toBe(true);
            expect(cookie.puppy).toBe("Layla");
            expect(res.statusCode).toBe(302);
        });
});
