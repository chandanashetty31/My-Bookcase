import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import pg from "pg";
import { fileURLToPath } from "url";

import dotenv from 'dotenv';
dotenv.config();
console.log(process.env);

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: process.env.database,
  password: process.env.password,
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files

// Route to fetch book data
app.get("/books", async (req, res) => {
  const books = [
    "9788172234980", // ISBN for "The Alchemist"
    "9781786330895", // ISBN for "Ikigai"
  ];

  try {
    // Fetch book data from Open Library
    const bookPromises = books.map((isbn) =>
      axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      )
    );

    const responses = await Promise.all(bookPromises);

    // Extract relevant book details
    const booksData = responses.map((response, index) => {
      const bookKey = `ISBN:${books[index]}`;
      const book = response.data[bookKey];

      return {
        title: book.title,
        authors: book.authors ? book.authors.map((a) => a.name).join(", ") : "Unknown",
        cover: book.cover ? book.cover.medium : "https://via.placeholder.com/150",
        isbn: books[index],
      };
    });

    console.log(booksData);
    try{
      for (let i = 0; i < booksData.length; i++) {
        const book = booksData[i];
    const checkBook = await db.query("SELECT * FROM book WHERE isbn = $1", [book.isbn]);

    if (checkBook.rows.length === 0) {
      // Insert into the database
      await db.query("INSERT INTO book (title, author, isbn) VALUES ($1, $2, $3)", [book.title, book.authors, book.isbn]);
    }

  }
  console.log("Books stored in database:", booksData);

} catch (error) {
  console.error("Error fetching book data:", error);
  res.status(500).send("Error fetching books");
}
    
    // Render index.ejs and pass the booksData
    res.render("index", { books: booksData ,
      title:booksData[0].title,
      author:booksData[0].authors,
      cover:booksData[0].cover,
      title_2:booksData[1].title,
      author_2:booksData[1].authors,
      cover_2:booksData[1].cover,
    });
   
  } catch (error) {
    console.error("Error fetching book data:", error);
    res.status(500).send("Error fetching books");
  }
});

app.get("/alchemist", (req, res) => {
  res.sendFile(__dirname + "/views/alchemistNotes.html");
});

app.get("/ikigai", (req, res) => {
  res.sendFile(__dirname + "/views/ikigai.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/views/sign-up.html");
});
app.get("/login",(req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});
app.post("/logedin",async(req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM userdata WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.redirect("/books");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
  
});

app.post("/signedup",async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM userdata WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      const result = await db.query(
        "INSERT INTO userdata (name ,email, password) VALUES ($1, $2, $3)",
        [name,email, password]
      );
      console.log(result);
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
