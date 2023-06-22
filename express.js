const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const prompt = require('prompt-sync')();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Manesha:maneshapalani02@cluster0.v2xaekf.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the Actor schema
const actorSchema = new Schema({
  name: String,
  cost: Number
});

// Define the Movie schema
const movieSchema = new Schema({
  movieName: String,
  actors: [actorSchema]
});

// Create the Movie model
const MovieModel = mongoose.model('Movie', movieSchema);

app.use(express.json());

// Route to create a new movie
app.post('/movies', async (req, res) => {
  try {
    const movieName = prompt('Enter the movie name: ');
    const n = parseInt(prompt(`How many actors are there in ${movieName}: `));
    const actors = [];

    for (let i = 0; i < n; i++) {
      const name = prompt(`Enter the actor's name ${i + 1}: `);
      const cost = parseInt(prompt(`Enter the actor's cost ${i + 1}: `));
      actors.push({ name, cost });
    }

    const movie = new MovieModel({
      movieName,
      actors
    });

    const savedMovie = await movie.save();
    res.json(savedMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

// Route to retrieve all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await MovieModel.find();
    res.json(movies);
  } catch (error) {
    console.error('Error retrieving movies:', error);
    res.status(500).json({ error: 'Failed to retrieve movies' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
