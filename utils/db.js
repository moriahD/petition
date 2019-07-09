var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:moriah:1234@localhost:5432/petition");
exports.getPetitioner = function getPetitioner() {
    return db.query("SELECT * FROM petitionLists");
};
// $1 syntax is used to prevent a type of attack called a SQL Injection!
exports.addPetitioner = function addPetitioner(
    first_name,
    last_name,
    signature
) {
    return db.query(
        `INSERT INTO petitionLists (first_name, last_name, signature)
        VALUES ($1, $2, $3) RETURNING *`,
        [first_name, last_name, signature]
    );
};
// SIGN UP : add users
exports.addUser = function addUser(first_name, last_name, email, password) {
    return db.query(
        `INSERT INTO users (first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4 ) RETURNING *;`,
        [first_name, last_name, email, password]
    );
};
//get total number of signers
exports.getNumbers = function getNumbers() {
    return db.query("SELECT COUNT(id) FROM petitionLists ");
};

exports.getNames = function getNames() {
    return db.query("SELECT * FROM petitionLists");
};
exports.getImage = function(id) {
    return db.query("SELECT signature FROM petitionLists WHERE id = " + id);
};
