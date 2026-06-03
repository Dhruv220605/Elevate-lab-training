const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear"
  },
  {
    id: 2,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki"
  }
];

// GET all books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// POST new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;

  const newBook = {
    id: books.length + 1,
    title,
    author
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook
  });
});

// PUT update book
app.put("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;

  res.status(200).json({
    message: "Book updated successfully",
    book
  });
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  books.splice(index, 1);

  res.status(200).json({
    message: "Book deleted successfully"
  });
});

app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

app.put("/abc", (req, res) => {
  res.send("PUT WORKING");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});