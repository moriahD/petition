-- this is how you do a comment in SQL!
DROP TABLE IF EXISTS petitionLists; --add this

CREATE TABLE petitionLists(
    id SERIAL PRIMARY KEY,
    user_id INT,
    signature TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); --if we don't put semicolon , sql doesn't know when it's done


-- how to enter or insert data into our cities TABLE, we are only defining here
INSERT INTO petitionLists(signature) VALUES (signature);

-- getting data from a table
SELECT * FROM petitionLists;

DROP TABLE IF EXISTS profile; --add this

CREATE TABLE profile(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(100),
    url VARCHAR(300),
    user_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

INSERT INTO profile (age,city,url,user_id ) VALUES (37, 'berlin', 'www.google.com', 1);

-- getting data from a table
SELECT * FROM profile;

DROP TABLE IF EXISTS users; --add this

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); --if we don't put semicolon , sql doesn't know when it's done


-- how to enter or insert data into our cities TABLE, we are only defining here
INSERT INTO users (first_name, last_name, email, password) VALUES (first_name, last_name, email, password);

-- getting data from a table
SELECT * FROM users;
