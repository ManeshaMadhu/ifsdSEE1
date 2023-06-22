const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Define the Actor schema
const actorSchema = new mongoose.Schema({
  name: String,
  cost: Number
});

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  n_movie: [actorSchema],
  sum_cost: Number,
  moviename: String
});

// Create the Actor model
const Actor = mongoose.model('Actor', actorSchema);

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

function display_actor(a) {
  console.log(`Actor ${a.id} cost is ${a.cost}`);
}

function display_sum_n_actors_cost(m) {
  for (let i of m.n_movie) {
    display_actor(i);
  }
  console.log(`The cost of all the actors is ${m.sum_cost}`);
}

function input_actor() {
  const name = prompt('Enter the actor\'s name: ');
  const cost = parseInt(prompt('Enter the actor\'s cost: '));
  return new Actor({ name, cost });
}

function input_n_actors() {
  let m = new Movie();
  const mn = prompt('Movie name: ');
  m.moviename = mn;
  const n = parseInt(prompt(`How many actors are there in ${m.moviename}: `));
  for (let i = 0; i < n; i++) {
    const actor = input_actor();
    m.n_movie.push(actor);
    m.sum_cost += actor.cost;
  }
  return m;
}

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://Manesha:maneshapalani02@cluster0.v2xaekf.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    let m = input_n_actors();

    // Create a new Movie document
    const movie = new Movie({
      n_movie: m.n_movie,
      sum_cost: m.sum_cost,
      moviename: m.moviename
    });

    // Save the Movie document to the database
    await movie.save();
    console.log('Movie saved to MongoDB');

    // Display the Movie document
    const savedMovie = await Movie.findOne({ _id: movie._id });
    display_sum_n_actors_cost(savedMovie);

    // Update the Movie document
    const movieToUpdate = await Movie.findOne({ _id: savedMovie._id });
    movieToUpdate.moviename = prompt('Enter the updated movie name: ');
    await movieToUpdate.save();
    console.log('Movie updated successfully');

    // Delete the Movie document
    await Movie.deleteOne({ _id: savedMovie._id });
    console.log('Movie deleted successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
