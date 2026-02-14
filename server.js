const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

/* ✅ MongoDB connection */
mongoose.connect(
  "mongodb+srv://movieuser:movie123@cluster0.clhigw7.mongodb.net/movieholic?retryWrites=true&w=majority"
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ DB Error:", err));


/* ✅ Schema */
const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number
});

const Movie = mongoose.model("Movie", movieSchema);


/* ✅ Home */
app.get("/", (req, res) => {
  res.send("Movieholic API running 🎬");
});


/* ✅ GET all movies */
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ✅ Add movie */
app.post("/movies", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ✅ Rate movie */
app.post("/rate", async (req, res) => {
  try {
    const { id, rating } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );

    if (!movie) {
      return res.json({ message: "Movie not found" });
    }

    res.json(movie);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ✅ Start server */
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
