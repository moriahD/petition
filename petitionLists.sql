-- this is how you do a comment in SQL!
DROP TABLE IF EXISTS petitionLists; --add this

CREATE TABLE petitionLists(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50),
    signature TEXT
); --if we don't put semicolon , sql doesn't know when it's done


-- how to enter or insert data into our cities TABLE, we are only defining here
INSERT INTO petitionLists (firstName, lastName, signature) VALUES (firstName, lastName, signature);

-- getting data from a table
SELECT * FROM petitionLists;



--CRUD: CREATE , READ, UPDATE, DELETE
