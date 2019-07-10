-- this is how you do a comment in SQL!
DROP TABLE IF EXISTS petitionLists; --add this

CREATE TABLE petitionLists(
    id SERIAL PRIMARY KEY,
    
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); --if we don't put semicolon , sql doesn't know when it's done


-- how to enter or insert data into our cities TABLE, we are only defining here
INSERT INTO petitionLists (signature) VALUES (signature);

-- getting data from a table
SELECT * FROM petitionLists;



--CRUD: CREATE , READ, UPDATE, DELETE
