const express = require('express');
const { moviesDb, ratingsDb } = require('./db');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// This is a Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Movies API');
});

// Start the Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
// This endpoint lists all the movies with 50 as limit http://localhost:3001/movies/
app.get('/movies', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 50;
    let offset = (page - 1) * limit;

    const sql = `SELECT imdbId, title, genres, releaseDate, budget FROM movies LIMIT ? OFFSET ?`;

    moviesDb.all(sql, [limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ page, movies: rows });
    });
});

// This endpoint lists details of a particular movie where ratings are pulled from ratings database limit http://localhost:3001/movies/2
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
    SELECT m.imdbId, m.title, m.overview, m.productionCompanies, 
           m.releaseDate, m.budget, m.revenue, m.runtime, 
           m.language, m.genres, 
           COALESCE(AVG(r.rating), 0) AS averageRating  
    FROM movies m
    LEFT JOIN ratings_db.ratings r ON m.movieId = r.movieId
    WHERE m.movieId = ?`;

    moviesDb.get(sql, [id], (err, row) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            console.warn("Movie not found for id:", id);
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json(row);
    });
});

// This endpoint lists all the movies all movies from a particular year  http://localhost:3001/movies/year/2018
app.get('/movies/year/:year', (req, res) => {
    let { year } = req.params;
    let page = parseInt(req.query.page) || 1;
    let limit = 50;
    let offset = (page - 1) * limit;
    let order = req.query.order === 'desc' ? 'DESC' : 'ASC';  

    const sql = `
        SELECT imdbId, title, genres, releaseDate, budget 
        FROM movies WHERE releaseDate LIKE ? 
        ORDER BY releaseDate ${order} 
        LIMIT ? OFFSET ?`;

        moviesDb.all(sql, [`${year}%`, limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ page, movies: rows });
    });
});

// This endpoint lists all the movies by a genre  http://localhost:3001/movies/genre/Drama
app.get('/movies/genre/:genre', (req, res) => {
    let { genre } = req.params;
    let page = parseInt(req.query.page) || 1;
    let limit = 50;
    let offset = (page - 1) * limit;

    const sql = `
        SELECT imdbId, title, genres, releaseDate, budget 
        FROM movies 
        WHERE genres LIKE ? 
        LIMIT ? OFFSET ?`;

        moviesDb.all(sql, [`%${genre}%`, limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ page, movies: rows });
    });
});

module.exports = app; 