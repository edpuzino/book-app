'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


app.use(express.static('./public'));

app.get('/ping', (request, response) => {
  response.send('pong');
});

app.get('/hello', (request, response) => {
  response.render('index.ejs');
});

app.get('/books', getBooks);

app.get('*', (request, response) => {
  response.render('pages/error');
});

function getBooks(request, response) {
  client.query('SELECT title, author, image_url FROM books;')
    .then(results => {
      console.log(results.rows);
      response.render('index', { books: results.rows });
    });
}

app.listen(PORT, () => console.log('Listening on PORT', PORT));

