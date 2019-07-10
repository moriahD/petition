join two table: when you join table, you can't insert,
//join

SELECT \* FROM singers
JOIN songs
ON singers.id = songs.singer_id;

//change names

SELECT singers.name AS singer_name, songs.name AS song
FROM singers
JOIN songs
ON signers.id = songs.singer_id;

//it shows full songs lists although some song doesn't have assigned signer

SELECT singers.name AS singer_name, songs.name AS song
FROM singers
FULL OUTER JOIN songs
ON signers.id = songs.singer_id;

//

SELECT singers.id, singers.name AS singer, songs.name AS song, albums.name AS album
FROM singers
LEFT JOIN songs
ON signers.id = songs.singer_id;
JOIN albums
ON singers.id = albums.singer_id;

---

-   Kill the first name and last name from the signatures table replace it with user_id

    DROP TABLE IF EXISTS user_profile CASCADE;
    CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(100),
    url VARCHAR(300),
    user_id INT REFERENCES users (id)
    )

-   Need a new GET route and POST route for the extra information page.
