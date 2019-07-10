var spicedPg = require("spiced-pg");
var db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:moriah:1234@localhost:5432/petition");
}

//get users info from users table
exports.getPetitioner = function getPetitioner() {
    return db.query("SELECT * FROM users");
};
// $1 syntax is used to prevent a type of attack called a SQL Injection!
exports.addSignature = function addSignature(signature) {
    return db.query(
        `INSERT INTO petitionLists (signature)
        VALUES ($1) RETURNING *`,
        [signature]
    );
};
// SIGN UP : add users to users table
exports.addUser = function addUser(first_name, last_name, email, password) {
    return db.query(
        `INSERT INTO users (first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4 ) RETURNING *;`,
        [first_name, last_name, email, password]
    );
};
//get total number of signers
exports.getNumbers = function getNumbers() {
    return db.query("SELECT COUNT(id) FROM users ");
};

exports.getNames = function getNames() {
    return db.query("SELECT * FROM users");
};
exports.getImage = function(id) {
    return db.query("SELECT signature FROM petitionLists WHERE id = " + id);
};
