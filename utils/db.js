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
exports.addSignature = function addSignature(signature, user_id) {
    return db.query(
        `INSERT INTO petitionLists (signature, user_id)
        VALUES ($1, $2) RETURNING *`,
        [signature, user_id]
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

exports.getNamesSigners = function getNames() {
    return db.query("SELECT * FROM petitionLists");
};
exports.getUserId = function(email) {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
};
exports.getSigByUserId = function(id) {
    return db.query(
        "SELECT signature FROM petitionLists WHERE user_id = $1 AND length(signature)>0",
        [id]
    );
};

////PROFILE ////
exports.addProfile = function addProfile(age, city, url, user_id) {
    return db.query(
        `INSERT INTO profile (age, city, url, user_id)
        VALUES ($1, $2, $3, $4 ) RETURNING *;`,
        [age, city, url, user_id]
    );
};

exports.getAllProfile = function getProfile() {
    return db.query(
        //i have to join the table
        `SELECT * FROM users
            FULL JOIN profile, petitionLists ON users.key=profile.key= petitionLists.key

            `
    );
};
