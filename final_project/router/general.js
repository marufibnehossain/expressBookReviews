//jshint esversion:6
const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// const doesExist = (username)=>{
//   let userswithsamename = users.filter((user)=>{
//     return user.username === username
//   });
//   if(userswithsamename.length > 0){
//     return true;
//   } else {
//     return false;
//   }
// }
// const app = express();

// app.use(express.json());

// public_users.post("/register", (req,res) => {
//   //Write your code here
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username && password) {
//     if (!isValid(username)) {
//       users.push({ "username": username, "password": password });
//       return res.status(201).json({ message: "User successfully registered. Now you can login" }); // Changed status to 201 Created
//     } else {
//       return res.status(409).json({ message: "User already exists!" }); // Changed status to 409 Conflict
//     }
//   }
//   return res.status(400).json({ message: "Unable to register user." }); // Changed status to 400 Bad Request
// });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Find the book by ISBN in your data

  if (book) {
    return res.json(book); // If the book is found, return its details as JSON
  } else {
    return res.status(404).json({ message: 'Book not found' }); // If the book is not found, return a 404 status and a message
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const authorBooks = {};

  for (const bookId in books) {
    if (books[bookId].author === authorName) {
      authorBooks[bookId] = books[bookId];
    }
  }

  return res.json(authorBooks);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title;
  const matchingBooks = {};

  for (const bookId in books) {
    if (books[bookId].title === bookTitle) {
      matchingBooks[bookId] = books[bookId];
    }
  }

  return res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Corrected to use req.params.isbn
  const book = books[isbn]; // Retrieve the book directly using the ISBN as the key

  if (book) {
    const reviews = book.reviews || {};
    return res.json(reviews);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});


async function fetchBooks() {
    try {
      // Access the 'books' data directly from the imported module
      return books;
    } catch (error) {
      throw error;
    }
  }
  
  // Usage example
  (async () => {
    try {
      const bookList = await fetchBooks();
      console.log(bookList);
    } catch (error) {
      console.error('Error fetching books:', error.message);
    }
  })();




  const getBookDetailsByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    // Check if the ISBN exists in the books JSON object
    if (books[isbn]) {
      // If it exists, resolve with the book details
      resolve(books[isbn]);
    } else {
      // If it doesn't exist, reject with an error message
      reject(new Error('Book not found'));
    }
  });
};

// Example of using the function with async/await
async function fetchBookDetails(isbn) {
  try {
    const bookDetails = await getBookDetailsByISBN(isbn);
    console.log(bookDetails);
    return bookDetails;
  } catch (error) {
    console.error('Error fetching book details:', error.message);
  }
}

// Usage
const isbnToFetch = '1'; // Replace with the ISBN you want to fetch
fetchBookDetails(isbnToFetch);



// Define a function that fetches book details by author using Axios and returns a Promise
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = {};

    // Loop through the books JSON object to find books by the specified author
    for (const isbn in books) {
      if (books[isbn].author === author) {
        matchingBooks[isbn] = books[isbn];
      }
    }

    // Check if any books by the author were found
    if (Object.keys(matchingBooks).length > 0) {
      // If books were found, resolve with the matching books
      resolve(matchingBooks);
    } else {
      // If no books were found, reject with an error message
      reject(new Error('No books found by this author'));
    }
  });
};

// Example of using the function with async/await
async function fetchBooksByAuthor(author) {
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    console.log(booksByAuthor);
    return booksByAuthor;
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
  }
}

// Usage
const authorToFetch = 'Chinua Achebe'; // Replace with the author name you want to fetch
fetchBooksByAuthor(authorToFetch);



// Define a function that fetches book details by title using Axios and returns a Promise
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = {};

    // Loop through the books JSON object to find books with the specified title
    for (const isbn in books) {
      if (books[isbn].title === title) {
        matchingBooks[isbn] = books[isbn];
      }
    }

    // Check if any books with the title were found
    if (Object.keys(matchingBooks).length > 0) {
      // If books were found, resolve with the matching books
      resolve(matchingBooks);
    } else {
      // If no books were found, reject with an error message
      reject(new Error('No books found with this title'));
    }
  });
};

// Example of using the function with async/await
async function fetchBooksByTitle(title) {
  try {
    const booksByTitle = await getBooksByTitle(title);
    console.log(booksByTitle);
    return booksByTitle;
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
  }
}

// Usage
const titleToFetch = 'Things Fall Apart'; // Replace with the title you want to fetch
fetchBooksByTitle(titleToFetch);

module.exports.general = public_users;