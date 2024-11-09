import axios from "axios";
import { Browser } from "puppeteer";
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const puppeteer = require("puppeteer");
const fs = require("fs");
const stringSimilarity = require("string-similarity");
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const session = require("express-session");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Midlleware
app.use(cors());
app.use(express.json());



///////////////////////////////////////////////////////////////////////////////////////////////////////////// Add Products

// Route for admin to add a new product
app.post("/add-product", async (req, res) => {
  try {
    // Destructure the product details from the request body
    const { title, price, imgSrc } = req.body;

    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    // Insert the new product into the products table
    const insertProductQuery = {
      text: `
        INSERT INTO allProducts (id, title, price, imgSrc)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      values: [uuidv4(), title, price, imgSrc]
    };

    // Execute the query
    const result = await pool.query(insertProductQuery);
    const newProduct = result.rows[0];

    // Send a success response with the newly created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding new product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////// Get Products
app.get("/products", async (req, res) => {
  try {
    const allProductsQuery = {
      text: `
        SELECT * FROM allProducts
      `,
    };
    const allProductsResult = await pool.query(allProductsQuery);

    const allProducts = allProductsResult.rows.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      imgSrc: product.imgsrc
    }));

    // Send JSON response with all product data
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Send error response as JSON
  }
});

// Start the server
const server = app.listen(4000, () => {
  console.log(`Server is running at http://localhost:${4000}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////// Get ProductsID
app.get("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Query to fetch details of the product with the given ID
    const productQuery = {
      text: `
        SELECT * FROM allProducts
        WHERE id = $1
      `,
      values: [productId],
    };
console.log(productId)
    // Fetch the details of the product with the given ID
    const productResult = await pool.query(productQuery);
    
    // Check if the product exists
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Send JSON response with the details of the product
    res.json(productResult.rows[0]);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Send error response as JSON
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////// Login/Register


app.use(bodyParser.json());

// Generate a random secret key for JWT
const secretKey = crypto.randomBytes(32).toString('hex');

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const queryResult = await pool.query('SELECT id, username, email, role FROM users');  // Include role field
    res.json(queryResult.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to create a new user
app.post('/users', async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;  // Default role is 'user'
  try {
    // Insert the new user with the specified role
    const queryResult = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *', 
      [username, email, password, role]
    );
    const newUser = queryResult.rows[0];
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Query to fetch user by email and password
    const queryResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2', 
      [email, password]
    );
    const user = queryResult.rows[0];

    if (user) {
      // Include the role in the JWT token payload
      const token = jwt.sign(
        { 
          email: user.email, 
          user_id: user.id, 
          username: user.username,
          role: user.role // Include role here
        },
        secretKey, 
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to logout (not implemented in PostgreSQL)
app.post('/logout', (req, res) => {
  // Implement logout logic here if needed
  res.json({ message: 'Logout successful' });
});

// Example protected route
app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Post Products reviews
app.post('/products/:productId/reviews', isAuthenticated, async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.user_id; // Extract user ID from decoded token
  const username = req.user.username;

  try {
    // Insert the review and comment into the allreviews table
    const queryResult = await pool.query(
      `INSERT INTO allReviews (user_id, username, product_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, username, productId, rating, comment]
    );
    
    const newReviewComment = queryResult.rows[0];
    res.status(201).json(newReviewComment);
  } catch (error) {
    console.error('Error submitting review and comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Get Products reviews
app.get('/products/:productId/reviews', async (req, res) => {
  const { productId } = req.params;

  try {
    // Query to fetch all reviews associated with the given productId from allReviews table
    const queryResult = await pool.query(
      `SELECT * FROM allReviews WHERE product_id = $1`,
      [productId]
    );

    const reviews = queryResult.rows;

    // Check if there are any reviews for the product
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this product' });
    }

    // Return reviews as JSON response
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews and comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  console.log(token)
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    console.log("Decoded Tpken", decodedToken)
    console.log("req.user", req.user)
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}