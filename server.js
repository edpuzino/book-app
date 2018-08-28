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


app.get('/ping', (request, response) => {
  response.send('pong');
});

app.get('/hello', (request, response) => {
  response.render('index', {books: []});
});

app.get('/books', (request, response) => {
  client.query('SELECT author, title, image_url FROM books;')
    .then(results => {
      response.render('index', { books: results.rows });
    });
});

app.get('*', (request, response) => {
  response.render('pages/error');
});

app.listen(PORT, () => console.log('Listening on PORT', PORT));
