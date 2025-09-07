// Your main server file, which remains largely the same.
// It doesn't need to know how the database is connected, only that it gets a valid connection.

import express from "express";
// Import our established database connection from firebase.js
import { db } from './firebase.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
// This middleware is essential for allowing our server to receive and parse JSON.
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- API ENDPOINTS ---

app.get('/', (req, res) => {
  res.send('Welcome to the ProfitLens API!');
});

/**
 * API Endpoint to create a new product in the database.
 * METHOD: POST
 * ROUTE: /api/products
 * BODY: { "asin": "...", "upc": "...", "sku": "...", "title": "...", "cost": ... }
 */
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;

    // --- Data Validation ---
    if (!productData.asin || typeof productData.cost === 'undefined') {
      return res.status(400).json({ success: false, message: 'ASIN and Cost are required fields.' });
    }

    // --- Creating the Document (Row) and Columns ---
    const productRef = db.collection('products').doc(productData.asin);

    const newProduct = {
      asin: productData.asin,
      upc: productData.upc || null,
      sku: productData.sku || null,
      title: productData.title || 'No Title Provided',
      cost: Number(productData.cost),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Use .set() to create the document with the specified fields (columns).
    await productRef.set(newProduct);

    console.log(`✔️ Product created/updated in Firestore with ASIN: ${productData.asin}`);

    // Send a success response back to the client
    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: newProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'An error occurred on the server.' });
  }
});


// Start your server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});