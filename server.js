'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');

const app = express();

const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
client.connect();
client.on('error', err => console.error(err));

app.set('view engine', 'ejs');
app.use(express.static('./public'));


//Callbacks
const books = (request, response) => {
  client.query('SELECT * FROM books;')
    .then(results => {
      response.render('index', { books: results.rows });
    });
};

const details = (request, response) => {
  const sql = `SELECT * FROM books WHERE id=($1)`;
  const values = [request.params.id];
  client.query(sql, values)
    .then (results => {
      response.render('pages/show', {books: results.rows})
    })
    .catch (err => console.log(err, response));
};

const addBook = (request, response) => {
  response.render('pages/new');
};


//Routes
app.get('/books', books);
app.get('/books/:id', details);
app.get('/add', addBook)

app.get('*', (request, response) => {
  response.render('pages/error');
});

app.listen(PORT, () => console.log('Listening on PORT', PORT));
