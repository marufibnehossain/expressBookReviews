//jshint esversion:6
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// let users = [];

// const isValid = (username)=>{ //returns boolean
//   const userWithSameName = users.find((user) => user.username === username);
//   return !!userWithSameName; // Use a more concise way to return true or false

// }
// const app = express();

// app.use(express.json());

// const authenticatedUser = (username,password)=>{ //returns boolean
//     let validusers = users.filter((user)=>{
//       return (user.username === username && user.password === password)
//     });
//     if(validusers.length > 0){
//       return true;
//     } else {
//       return false;
//     }
//   }
//   app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
// //only registered users can login
// regd_users.post("/login", (req,res) => {
//     const username = req.body.username;
//     const password = req.body.password;
  
//     if (!username || !password) {
//         return res.status(404).json({message: "Error logging in"});
//     }
  
//     if (authenticatedUser(username,password)) {
//       let accessToken = jwt.sign({
//         data: password
//       }, 'access', { expiresIn: 60*60 });
  
//       req.session.authorization = {
//         accessToken,username
//     }
//     return res.status(200).send("User successfully logged in");
//     } else {
//       return res.status(208).json({message: "Invalid Login. Check username and password"});
//     }
// });
const app = express();

app.use(express.json());

app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use(express.json());

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      books[isbn].reviews[username] = review;
      return res.status(201).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get the username from the session
  
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      // Check if the book has reviews
      if (books[isbn].reviews) {
        // Check if the user has posted a review for this book
        if (books[isbn].reviews[username]) {
          // Delete the user's review
          delete books[isbn].reviews[username];
          return res.status(200).json({ message: "Review deleted successfully" });
        } else {
          return res.status(404).json({ message: "Review not found for the user" });
        }
      } else {
        return res.status(404).json({ message: "No reviews found for the book" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
// module.exports.users = users;
