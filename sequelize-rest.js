const Sequelize = require("sequelize");
const connectionString = "postgresql://postgres:secret@localhost:5432/postgres";
const sequelize = new Sequelize(connectionString, { logging: false });

const Movie = sequelize.define("movie", {
  title: Sequelize.TEXT,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.TEXT
});

sequelize
  .sync()
  .then(() => console.log("DATABASE SYNCED!"))
  .then(() =>
    Promise.all([
      Movie.create({
        title: "The Matrix",
        yearOfRelease: 1999,
        synopsis: "Awesome movie 1"
      }),
      Movie.create({
        title: "The Matrix Reloaded",
        yearOfRelease: 2003,
        synopsis: "Awesome movie 2"
      }),
      Movie.create({
        title: "The Matrix Revolutions",
        yearOfRelease: 2003,
        synopsis: "Awesome movie 3"
      })
    ])
  )
  .catch(error => {
    console.log("Something is wrong with the table");
    console.log(error);
    process.exit(1);
  });

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//Create a new movie
app.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(title => res.json(title))
    .catch(next);
});

//Read all movies
// app.get("/movie", (req, res, next) =>
//   Movie.findAll()
//     .then(movies => {
//       return res.json({ movies: movies });
//     })
//     .catch(error => next(error))
// );
app.get("/movie", (req, res, next) => {
  const limit = req.query.limit || 3;
  const offset = req.query.offset || 0;

  Movie.count()
    .then(total =>
      Event.findAll({ limit, offset }).then(movies => {
        return res.json({ movies: movies });
      })
    )
    .catch(error => next(error));
});

//Read one movie information
app.get("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (!movie) {
        res.status(404).end();
      } else {
        res.json(movie);
      }
    })
    .catch(next);
});

//Update a movie
app.put("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return movie.update(req.body).then(movie => res.json(movie));
      }
      return res.status(404).end();
    })
    .catch(next);
});

//Delete a movie
app.delete("/movie/:id", (req, res, next) => {
  Movie.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.send({ numDeleted });
      }
      return res.status(404).end();
    })
    .catch(next);
});
