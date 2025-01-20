const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'Forms')));

// Session middleware
app.use(session({
  secret: '2032huzaifa',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

function isProtectedHtml(req) {
  const allowedPaths = ['/login.html', '/signup.html'];
  return req.url.endsWith('.html') && !allowedPaths.includes(req.url);
}

// Middleware to check session for protected HTML files
function checkSession(req, res, next) {
  if (isProtectedHtml(req) && !req.session.user) {
    res.redirect('/login.html');
  } else {
    next();
  }
}

app.use(checkSession);

app.use('/Admin-End', express.static(path.join(__dirname, 'Admin-End')));
app.use('/User-End', express.static(path.join(__dirname, 'User-End')));

// Display the listing of Book Entries
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route to Signup User
app.post('/signup', async (req, res) => {
  const { username, password, rpassword } = req.body;

  if (password !== rpassword) {
    return res.status(400).send('Passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, 'user'], (err, results) => {
    if (err) {
      return res.status(500).send('Username already exists!');
    }
    res.send('User registered successfully!');
  });
});

// Route to Login Admin/User
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Incorrect password');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.status(200).send(user.role === 'admin' ? 'admin' : 'user');
  });
});

// Route for Logout Admin/User
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login.html');
  });
});

// Route for handling file uploads and adding a book
const uploadDir = path.join(__dirname, 'Admin-End', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/Addbook', upload.single('Bookpic'), (req, res) => {
  const { BookName, Author, Category } = req.body;
  const Bookpic = req.file;

  const relativePath = path.join('uploads', Bookpic.filename);

  const query = "INSERT INTO `books` (`BookName`, `Author`, `Category`, `Bookpic`) VALUES (?, ?, ?, ?)";
  const values = [BookName, Author, Category, relativePath];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding the book.');
    }
    res.status(200).send('Book added successfully!');
  });
});

// Route to Rent Book!!
app.post('/rentBook', (req, res) => {
  const { book_id, duration, purpose } = req.body;
  const { id: user_id, username } = req.session.user;

  const query = "INSERT INTO `rentals` (`book_id`, `user_id`, `username`, `duration`, `purpose`) VALUES (?, ?, ?, ?, ?)";
  const values = [book_id, user_id, username, duration, purpose];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'You Already Ranted this Book!!' });
    }
    res.status(200).json({ message: 'Book rented successfully!' });
  });
});

// Route to fetch entries field to populate them in Edit form on the basis of Entry Id!!
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const query = 'SELECT * FROM books WHERE id = ?';
  db.query(query, [bookId], (err, results) => {    
    res.json(results[0]);
  });
});

// Route to Update Book Entry!!
app.post('/books/:id', upload.single('Bookpic'), (req, res) => {
  const { id } = req.params; 
  const { BookName, Author, Category } = req.body; 
  const Bookpic = req.file;

  const relativePath = path.join('uploads', Bookpic.filename);

  let sql = 'UPDATE books SET BookName = ?, Author = ?, Category = ?, Bookpic = ? WHERE id = ?';
  let values = [BookName, Author, Category, relativePath, id];

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ success: false, message: 'Failed to update the book.' });
    } else {
      res.json({ success: true, message: 'Book updated successfully!' });
    }
  });
});

// Route to delete books from the Table!!
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  
  const deleteQuery = 'DELETE FROM books WHERE id = ?';
  
  db.query(deleteQuery, [bookId], (err, result) => {
      if (err) {
          console.error('Error deleting book:', err);
          return res.status(500).json({ success: false, message: 'Failed to delete the book.' });
      }
      
      if (result.affectedRows > 0) {
          res.json({ success: true, message: 'Book deleted successfully.' });
      } else {
          res.status(404).json({ success: false, message: 'Book not found.' });
      }
  });
});

// Route for fetching Reserved Books agaist session user_id & username!!
app.get('/Reservedbooks', (req, res) => {
  const { id: user_id, username } = req.session.user;

  const query = `SELECT book_id, user_id, username, duration, purpose, time FROM rentals WHERE user_id = ? AND username = ?`;
  db.query(query, [user_id, username], (err, results) => {
      if (err) {
          console.error('Error fetching data:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (Array.isArray(results)) {
          res.json(results);
      } else {
          res.status(500).json({ message: 'Unexpected response format from database' });
      }
  });
});

// Route for fetching entries to display in adminsite!!
app.get('/booklogs', (req, res) => {
  const query = `SELECT book_id, user_id, username, duration, purpose, time FROM rentals`;
  db.query(query, (err, results) => {
      res.json(results);
  });
});

// Start the server!!
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});