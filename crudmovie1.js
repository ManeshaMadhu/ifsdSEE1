const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class Actor {
  static id = 1;

  constructor(name, cost) {
    this.id = Actor.id;
    Actor.id += 1;
    this.name = name;
    this.cost = cost;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      cost: this.cost
    };
  }
}

class Movie {
  constructor() {
    this.n_movie = [];
    this.sum_cost = 0;
    this.moviename = "";
  }

  append(m) {
    this.n_movie.push(m);
  }

  find_sum_cost() {
    for (let i of this.n_movie) {
      this.sum_cost += i.cost;
    }
  }

  toObject() {
    return {
      n_movie: this.n_movie.map(actor => actor.toObject()),
      sum_cost: this.sum_cost,
      moviename: this.moviename
    };
  }
}

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
  return new Actor(name, cost);
}

function input_n_actors() {
  let m = new Movie();
  const mn = prompt('Movie name: ');
  m.moviename = mn;
  const n = parseInt(prompt(`How many actors are there in ${m.moviename}: `));
  for (let i = 0; i < n; i++) {
    const actor = input_actor();
    m.append(actor);
  }
  return m;
}

async function saveMovies(db, movies) {
  const collection = db.collection('movies'); // Replace 'movies' with your collection name
  const moviesObj = movies.map(movie => movie.toObject());
  await collection.insertMany(moviesObj);
  console.log('Movies saved to MongoDB');
}

async function updateMovie(db, movieId, updatedName) {
  const collection = db.collection('movies'); // Replace 'movies' with your collection name
  await collection.updateOne({ _id: movieId }, { $set: { moviename: updatedName } });
  console.log('Movie updated successfully');
}

async function deleteMovie(db, movieId) {
  const collection = db.collection('movies'); // Replace 'movies' with your collection name
  await collection.deleteOne({ _id: movieId });
  console.log('Movie deleted successfully');
}

async function displayMovies(db) {
  const collection = db.collection('movies'); // Replace 'movies' with your collection name
  const movies = await collection.find().toArray();

  for (let movie of movies) {
    display_sum_n_actors_cost(movie);
  }
}

async function main() {
  const uri = 'mongodb+srv://Manesha:maneshapalani02@cluster0.v2xaekf.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('Movie'); // Replace 'mydatabase' with your database name

    let movies = [];
    let m = input_n_actors();
    m.find_sum_cost();
    movies.push(m);

    // You can add a loop here to allow the user to input multiple movies

    await saveMovies(db, movies);
    await displayMovies(db);

    // Update the movie
    const movieIdToUpdate = prompt('Enter the ID of the movie to update: ');
    const updatedName = prompt('Enter the updated movie name: ');
    await updateMovie(db, movieIdToUpdate, updatedName);

    // Delete the movie
    const movieIdToDelete = prompt('Enter the ID of the movie to delete: ');
    await deleteMovie(db, movieIdToDelete);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main();
