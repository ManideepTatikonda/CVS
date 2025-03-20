const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const moviesDbPath = path.resolve(__dirname, 'db', 'movies.db');
const ratingsDbPath = path.resolve(__dirname, 'db', 'ratings.db');

const moviesDb = new sqlite3.Database(moviesDbPath, (err) => {
    if (err) {
        console.error("Error opening movies database:", err.message);
    } else {
        console.log("Connected to movies database.");
    }
});

const ratingsDb = new sqlite3.Database(ratingsDbPath, (err) => {
    if (err) {
        console.error("Error opening ratings database:", err.message);
    } else {
        console.log("Connected to ratings database.");
    }
});

moviesDb.serialize(() => {
    moviesDb.run(`ATTACH DATABASE '${ratingsDbPath}' AS ratings_db`);
});

module.exports = { moviesDb, ratingsDb };

