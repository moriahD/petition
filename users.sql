-- this is how you do a comment in SQL!
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
