DROP TABLE IF EXISTS profile; --add this

CREATE TABLE profile(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(100),
    url VARCHAR(300),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO profile (age,city,url,user_id ) VALUES (37, 'berlin', 'www.google.com', user_id);

-- getting data from a table
SELECT * FROM profile;
