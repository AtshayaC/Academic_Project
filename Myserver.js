const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/acadamic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error('MongoDB connection error:', err));

// Define Product Schema without unique constraints
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },  // No unique constraint
  name: { type: String, required: true },        // No unique constraint
  costPerPiece: { type: Number, required: true },
  importedQuantity: { type: Number, required: true },
  importedDate: { type: Date, required: true },
  exportedQuantity: { type: Number, default: 0 },
  exportedDate: { type: Date, default: null },
});

// Create Product Model
const Product = mongoose.model('Product', productSchema);

// API Endpoints

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

// Import a new product
app.post('/api/products', async (req, res) => {
  console.log('Received body:', req.body);
  const { productId, name, costPerPiece, importedQuantity, importedDate } = req.body;
  try {
    const product = new Product({
      productId,
      name,
      costPerPiece,
      importedQuantity,
      importedDate: new Date(importedDate),
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: 'Failed to import product', error: err });
  }
});
// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err });
  }
});


// Filter products
app.get('/api/products/filter', async (req, res) => {
  const { field, value } = req.query;
  try {
    const filter = {};
    if (field && value) {
      filter[field] = value;  // Use field/value provided in query
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering products', error: err });
  }
});
// Export a product by updating the exported quantity and date
// Export a product by updating the exported quantity and date
// Export a product by updating the exported quantity and date
app.post('/api/products/export/:id', async (req, res) => {
  const productId = req.params.id;
  const { exportedQuantity, exportedDate } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { exportedQuantity: exportedQuantity }, exportedDate: new Date(exportedDate) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error exporting product:', err);
    res.status(500).json({ message: 'Failed to export product', error: err });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


