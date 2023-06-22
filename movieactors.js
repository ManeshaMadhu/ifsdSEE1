const prompt = require('prompt-sync')();

class Actor {
  static id = 1;

  constructor(name, cost) {
    this.id = Actor.id;
    Actor.id += 1;
    this.name = name;
    this.cost = cost;
  }
}

class Movie {
  constructor() {
    this.n_actor = [];
    this.sum_cost = 0;
    this.moviename = "";
  }

  append(m) {
    this.n_actor.push(m);
  }

  find_sum_cost() {
    for (let i of this.n_actor) {
      this.sum_cost += i.cost;
    }
  }
}

function display_actor(a) {
  console.log(`Actor ${a.id} cost is ${a.cost}`);
}

function display_sum_n_actors_cost(m) {
  for (let i of m.n_actor) {
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

function main(){
  let m = input_n_actors();
  m.find_sum_cost();
  display_sum_n_actors_cost(m)
}

main();
