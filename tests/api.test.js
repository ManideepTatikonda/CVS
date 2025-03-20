const request = require("supertest");
const app = require("../server");

describe("Movies API", () => {
  
  it("should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Welcome to the Movies API");
  });

  it("should return a paginated list of movies", async () => {
    const res = await request(app).get("/movies?page=1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("movies");
    expect(Array.isArray(res.body.movies)).toBe(true);
  });

  it("should return movie details by ID", async () => {
    const res = await request(app).get("/movies/2"); 
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("imdbId");
    expect(res.body).toHaveProperty("title");
  });

  it("should return movies from a specific year", async () => {
    const res = await request(app).get("/movies/year/2018?page=1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("movies");
    expect(Array.isArray(res.body.movies)).toBe(true);
  });

  it("should return movies sorted by year in descending order", async () => {
    const res = await request(app).get("/movies/year/2018?page=1&order=desc");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("movies");
  });

  it("should return movies by genre", async () => {
    const res = await request(app).get("/movies/genre/Drama?page=1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("movies");
    expect(Array.isArray(res.body.movies)).toBe(true);
  });

  it("should return an empty array for a non-existing genre", async () => {
    const res = await request(app).get("/movies/genre/UnknownGenre?page=1");
    expect(res.status).toBe(200);
    expect(res.body.movies.length).toBe(0);
  });

});
