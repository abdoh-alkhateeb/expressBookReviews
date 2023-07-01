const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();

const users = [];

const isValid = (username) => users.some((entry) => entry.username === username);

const authenticatedUser = (username, password) => {
  const user = users.find((entry) => entry.username === username);
  return user && user.password === password;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username. Please register an account." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password. Please try again." });
  }

  // Generate and sign a JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: 3600 });
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Customer successfully logged in." });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { user } = req;
  const { isbn } = req.params;
  const { review } = req.query;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  books[isbn].reviews[user] = review;

  return res.status(200).json({ message: "Review added or modified successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { user } = req;
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews[user]) {
    return res.status(404).json({ message: "Review not found." });
  }

  delete books[isbn].reviews[user];

  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
