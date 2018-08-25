CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY, 
  author VARCHAR(255), 
  title VARCHAR(255), 
  isbn VARCHAR(255), 
  image_url VARCHAR(255), 
  description TEXT
);

{
  'title': 'Battlefield Earth',
  'author': 'L. Ron Hubbard'
  'isbn': '9781592120079'
  'image_url': 'http://books.google.com/books/content?id=KF2hckiYTocC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
  'description': 'Jonnie Goodboy Tyler ventures out of the tiny community of humans barely surviving in the Rocky Mountain refuge and finds himself challenging the Psychlos, the malignant and oppressive alien conquerors of Earth.'
}

INSERT INTO books (author, title, isbn, image_url, description) VALUES('L. Ron Hubbard', 'Battlefield Earth', '9781592120079', 'http://books.google.com/books/content?id=KF2hckiYTocC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Jonnie Goodboy Tyler ventures out of the tiny community of humans barely surviving in the Rocky Mountain refuge and finds himself challenging the Psychlos, the malignant and oppressive alien conquerors of Earth.');