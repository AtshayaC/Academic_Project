const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stockmanagements';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Product Schema and Model
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  costPerPiece: { type: Number, required: true },
  importedQuantity: { type: Number, required: true },
  importedDate: { type: Date, required: true },
  exportedQuantity: { type: Number, default: 0 },
  exportedDate: { type: Date },
  balanceQuantity: { type: Number, required: true },
  totalPrice: { type: Number, default: 0 }  // Total price is based on exported quantity
});

const Product = mongoose.model('Product', productSchema);

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Import a new product
app.post('/api/products', async (req, res) => {
  try {
    const { productId, name, costPerPiece, importedQuantity, importedDate } = req.body;

    const newProduct = new Product({
      productId,
      name,
      costPerPiece,
      importedQuantity,
      importedDate,
      balanceQuantity: importedQuantity, // Initial balance equals imported quantity
      totalPrice: 0
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error importing product', error });
  }
});

// Export goods for a specific product
app.post('/api/products/export/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    // Check if quantity is valid
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if enough balance is available for export
    if (product.balanceQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough goods to export' });
    }

    // Update exported quantity, balance, and total price
    product.exportedQuantity += parseInt(quantity, 10);
    product.balanceQuantity -= quantity; // Deduct exported quantity from balance
    product.totalPrice = product.exportedQuantity * product.costPerPiece; // Calculate total price
    product.exportedDate = new Date();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting product', error });
  }
});

// Calculate GST
app.get('/api/total-amount-with-gst', async (req, res) => {
  try {
    const gstPercentage = parseFloat(req.query.gstPercentage) || 18; // Default to 18% if not provided

    // Fetch total amount from products
    const products = await Product.find();
    const totalAmount = products.reduce((acc, prod) => acc + prod.totalPrice, 0);

    // Calculate GST
    const gstAmount = (totalAmount * gstPercentage) / 100;
    const totalAmountWithGst = totalAmount + gstAmount;

    res.json({
      totalAmount,
      gstAmount,
      totalAmountWithGst
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating GST', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
