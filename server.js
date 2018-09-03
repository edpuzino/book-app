'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
client.connect();
client.on('error', err => console.error(err));

app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

//Callbacks
const books = (request, response) => {
  client.query('SELECT title, author, image_url, id FROM books;')
    .then(results =>
      response.render('index', {books: results.rows}))
    .catch (err => handleError(err, response));
};

const details = (request, response) => {
  let sql = `SELECT * FROM books WHERE id=$1`;
  let values = [request.params.id];
  client.query(sql, values)
    .then(
      result => response.render('pages/show', {book: result.rows[0]}))
    .catch (err => handleError(err, response));
};

const newBook = (request, response) => {
  response.render('pages/new');
};

const searchBook = (request, response) => {
  response.render('pages/search');
};

const addBook = (request, response) => {
  let {title, author, isbn, image_url, description} = request.body;
  let SQL = `INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`;
  let values = [title, author, isbn, image_url, description];
  return client.query(SQL, values).then(() => {
    response.render('pages/add', {book: request.body}).catch(err => handleError(err, response));
  }).catch(err => handleError(err, response));
};



//Routes
app.get('/', (request, response) => {response.redirect('/books');});
app.get('/books', books);
app.get('/add', newBook);
app.get('/search', searchBook);
app.get('/books/:id', details);
app.post('/add', addBook);

app.get('*', (request, response) => {
  response.render('pages/error');
});


function handleError(error, response) {
  response.render('pages/error', {error: error});
}

app.listen(PORT, () => console.log('Listening on PORT', PORT));
