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
    console.log(user_id);
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
// exports.getNumbers = function getNumbers() {
//     return db.query("SELECT COUNT(id) FROM users ");
// };

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
    //i need to check if url is starting with http/https
    console.log("adding url creating profile", url);
    return db.query(
        `INSERT INTO profile (age, city, url, user_id)
        VALUES ($1, $2, $3, $4 ) RETURNING *;`,
        [age, city, url, user_id]
    );
};
exports.getSignerName = function getSignerName(user_id) {
    return db.query(
        `
        SELECT * FROM petitionlists LEFT JOIN users on petitionlists.user_id = users.id WHERE user_id = $1 AND length(signature)>0`,
        [user_id]
    );
};
exports.getAllProfile = function getProfile() {
    return db.query(
        `SELECT users.first_name, users.last_name, profile.age, profile.city, profile.url
FROM users LEFT JOIN profile ON users.id = profile.user_id
JOIN petitionlists ON users.id = petitionlists.user_id;`
    );
};
exports.getSignersByCity = function getSignersByCity(city) {
    return db.query(
        `
        select * from profile join users on profile.user_id = users.id WHERE LOWER(city) = LOWER($1)
    `,
        [city]
    );
};
exports.getUserInfoById = function getUserInfoById(usersId) {
    return db.query(
        `select * from users left join profile on users.id = profile.id WHERE users.id = $1`,
        [usersId]
    );
};
exports.updateUserPassword = function updateUserPassword(password, id) {
    return db.query(`UPDATE users SET password = $1  WHERE id = $2`, [
        password,
        id
    ]);
};
exports.updateUserNoPassword = function updateUserNoPassword(
    first_name,
    last_name,
    email,
    id
) {
    return db.query(
        `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4  RETURNING *;`,
        [first_name, last_name, email, id]
    );
};
exports.updateProfile = function updateProfile(user_id, age, city, url) {
    return db.query(
        `INSERT INTO profile (user_id, age, city, url)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $2, city = $3, url = $4`,
        [user_id, age || null, city || null, url || null]
    );
};
