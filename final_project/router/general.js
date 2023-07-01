const express = require("express");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  const existingUser = users.find((entry) => entry.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const bookList = await getBookList();
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = await getBookByISBN(isbn);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});
  
// Get all books based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params;
  const booksByAuthor = Object.fromEntries(Object.entries(books).filter(entry => entry[1].author === author));
  return res.status(200).json({ booksbyauthor: booksByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const { title } = req.params;
  const booksByTitle = Object.fromEntries(Object.entries(books).filter(entry => entry[1].title === title));
  return res.status(200).json({ booksbytitle: booksByTitle });
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Function to get the book list
function getBookList() {
  return new Promise((resolve, reject) => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
}

// Function to get book details based on ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      const book = books[isbn];
      resolve(book);
    }, 1000);
  });
}

module.exports.general = public_users;
