'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
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

const createSearch = (request, response) => {
  let url = 'https://www.googleapis.com/books/v1/volumes';
  let query = '';
  let modifiedRequest = request.body.search[0].split(' ').join('+');
  if (request.body.search[1] === 'title') query += `+intitle:${modifiedRequest}`;
  if (request.body.search[1] ==='author') query += `+inauthor:${modifiedRequest}`;

  superagent.get(url).query({'q': query}).then(apiResponse => apiResponse.body.items.map(bookResult =>{
    let {title, subtitle, authors, industryIdentifiers, imageLinks, description} = bookResult.volumeInfo;
    let placeholderImage = 'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';

    return {
      title: title ? title : 'No title available',
      subtitle: subtitle ? subtitle : '',
      author: authors ? authors[0] : 'No authors available',
      isbn: industryIdentifiers ? `ISBN_13 ${industryIdentifiers[0].identifier}` : 'No ISBN available',
      image_url: imageLinks ? imageLinks.thumbnail : placeholderImage,
      description: description ? description : 'No description available',
      id: industryIdentifiers ? `${industryIdentifiers[0].identifier}` : '',
    };
  })).then(results => response.render('pages/newShow', {results: results})).catch(err => handleError(err, response));
}

//Routes
app.get('/', (request, response) => {response.redirect('/books');});
app.get('/books', books);
app.get('/add', newBook);
app.get('/search', searchBook);
app.get('/books/:id', details);
app.post('/add', addBook);
app.post('/searches', createSearch);
/*
app.get('/super', (request, response) => {
  superagent.get(url).query({'q': query}).then(results => {
    response.send(results.body)
  });
});
*/

app.get('*', (request, response) => {
  response.render('pages/error');
});


function handleError(error, response) {
  response.render('pages/error', {error: error});
}

app.listen(PORT, () => console.log('Listening on PORT', PORT));
