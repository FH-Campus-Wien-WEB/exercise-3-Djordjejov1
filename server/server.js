const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
  const genres = new Set();

  Object.values(movieModel).forEach(function (movie) {
    movie.Genres.forEach(function (genre) {
      genres.add(genre); // doppelte werden automatisch ignoriert
    });
  });

  res.send(Array.from(genres).sort()); // sortiert zurückgeben
});

/* Task 1.4 / Task 2.2:
   - Client schickt z.B. /movies?genre=Action
   - Server liest req.query.genre
   - Wenn genre vorhanden ist -> filtern
   - Wenn nicht -> alle zurückgeben
*/
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);

  const genre = req.query.genre; // genre aus url holen

  if (genre) {
    movies = movies.filter(function (movie) {
      return movie.Genres.includes(genre); // nur passende filme
    });
  }

  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[id] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")