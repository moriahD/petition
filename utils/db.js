var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:moriah:1234@localhost:5432/petition");

exports.getPetitioner = function getPetitioner() {
    return db.query("SELECT * FROM petitionLists");
};
// $1 syntax is used to prevent a type of attack called a SQL Injection!
exports.addPetitioner = function addPetitioner(firstName, lastName, signature) {
    return db.query(
        `INSERT INTO petitionLists (firstName, lastName, signature)
        VALUES ($1, $2, $3) RETURNING *`,
        [firstName, lastName, signature]
    );
};
exports.getNumbers = function getNumbers() {
    return db.query("SELECT COUNT(id) FROM petitionLists ");
};

/*
steps to completing part 1:

required express-handlebars templates:
- "petition" template with a <canvas> element that the user can actually sign
    - you'll need front-end JS for this. the JS file that contains this code sould live in your "public" foler(alongside CSS, imgs, etc.)
- "thank you" template that will thank the user for signing the petition, and will include a link to the next page
    - should also render the number of people who have signed the petition

- "signers" template that should render the first and last names of everyone who has signed the petition
- and you'll need 1 layout

SQL stuff
- we'll need a database and a table for this project.
- create a table called "signatures" that has the following columns: id, first, last, signature(the signature's data type should be TEXT), timestamp
    - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

DB queries
- INSERT when user signs the petition(so provides first, last, and signature)
- SELECT to get number of signers
- SELECT to get the first and last names of everyone who has signed

Server Routes
- GET /petition
    - renters petition template with canvas element
- POST /petition
    - that will run whenever the user signs the petition
- GET /thanks(or /signed - you can call it whatever)
    - renders "thank you" template
- GET /signers
    - renders the "signers" template. will need the first and last names of everyone whose signed petition


** <canvas>
- we need to figure it out how user made signature
- whenever they sign, the url is created... use "toDataURL"
- when user put mouse over the signature field, "toDataURL" is called on the canvas
- then, send this data to server.

//part 2
cookies are tiny!
they can only store about 4000 bytes. (that's 4kb)
because cookies are so small we can't store the user's signature in a cookie.
we can store a reference to the sugnature in a cookie. the reference in this case will be the id that was generated when a signature was inserted.


create the database once per every project.
run the create table commands once and every time you change the create table command (let's say you change the name of a column, or add a column, etc.)

every time we make a change to a SQL file, we MUST run "psql nameOfDATAbase -f nameoffile.sql" in bash

every single SELECT, UPDATE, INSERT, and DELETE query will live in this file.

Every single function defined in db.js will be invoked in index.js
*/
