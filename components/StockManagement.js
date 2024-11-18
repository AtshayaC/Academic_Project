import React, { useState, useEffect } from 'react';
import GSTCalculation from './GSTCalculations'; 
import './StockManagement.css';

// Function to format date from input to DD-MM-YYYY
const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  if (isNaN(date)) return 'Invalid Date'; // Handle invalid date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`; // Format the date as DD-MM-YYYY
};

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    productId: '',
    name: '',
    costPerPiece: '',
    importedQuantity: '',
    importedDate: formatDate(new Date()),
  });
  const [showCustomName, setShowCustomName] = useState(false);
  const [importedGoods, setImportedGoods] = useState(0);
  const [exportedGoods, setExportedGoods] = useState(0);
  const [balanceGoods, setBalanceGoods] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filter, setFilter] = useState({ field: '', value: '' });
  const [productIds, setProductIds] = useState(['T001', 'P001', 'J001']);
  const [productNames, setProductNames] = useState(['T-shirt', '3/4th Pant', 'Jerkin', 'AAA']);

  useEffect(() => {
    fetchProducts(); // Fetch all products initially
  }, []);

  useEffect(() => {
    const calculateGoods = () => {
      const importedTotal = products.reduce((acc, prod) => acc + (prod.importedQuantity || 0), 0);
      const exportedTotal = products.reduce((acc, prod) => acc + (prod.exportedQuantity || 0), 0);
      const totalAmount = products.reduce((acc, prod) => acc + (prod.totalPrice || 0), 0);

      setImportedGoods(importedTotal);
      setExportedGoods(exportedTotal);
      setBalanceGoods(importedTotal - exportedTotal);
      setTotalAmount(totalAmount);
    };

    calculateGoods();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const updatedProducts = data.map(prod => ({
        ...prod,
        totalPrice: (prod.costPerPiece || 0) * (prod.exportedQuantity || 0),
        importedDate: formatDate(prod.importedDate), // Format imported date
        exportedDate: prod.exportedDate ? formatDate(prod.exportedDate) : null, // Format exported date
      }));

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleProductSelect = (e) => {
    const selectedProduct = e.target.value;
    if (selectedProduct === 'Other') {
      setShowCustomName(true);
      setProduct({ ...product, productId: '', name: '' });
    } else {
      const productIdMap = {
        'T-shirt': 'T001',
        '3/4th Pant': 'P001',
        'Jerkin': 'J001',
       
      };
      setShowCustomName(false);
      setProduct({
        ...product,
        productId: productIdMap[selectedProduct],
        name: selectedProduct,
      });
    }
  };

  const handleImport = async () => {
    console.log('Product to import:', product); // Log the product object

    try {
      const response = await fetch(`http://localhost:5001/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          importedDate: product.importedDate, // Send as-is since it's already formatted
        }), 
      });

      if (!response.ok) throw new Error('Failed to import product');
      const data = await response.json();
      const newProduct = {
        ...data,
        totalPrice: (data.costPerPiece || 0) * (data.exportedQuantity || 0),
        importedDate: formatDate(data.importedDate), // Format imported date
        exportedDate: data.exportedDate ? formatDate(data.exportedDate) : null, // Format exported date
      };
      setProducts([...products, newProduct]);
      setProduct({
        productId: '',
        name: '',
        costPerPiece: '',
        importedQuantity: '',
        importedDate: formatDate(new Date()), // Reset the form with current date
      });
    } catch (error) {
      console.error('Error importing product:', error);
    }
  };

  const handleExport = async (id) => {
  const exportQuantity = prompt('Enter quantity to export:');
  if (!exportQuantity || isNaN(exportQuantity)) {
    alert('Invalid export quantity');
    return;
  }

  const exportedDateInput = prompt('Enter export date (DD-MM-YYYY):', formatDate(new Date())); // Prompt for date input
  if (!exportedDateInput) {
    alert('Export date is required');
    return;
  }

  // Convert the DD-MM-YYYY format to a Date object
  const [day, month, year] = exportedDateInput.split('-').map(Number);
  const exportedDate = new Date(year, month - 1, day); // Month is 0-based in JS

  // Check if the date is valid
  if (isNaN(exportedDate.getTime())) {
    alert('Invalid export date');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5001/api/products/export/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exportedQuantity: Number(exportQuantity), exportedDate }), // Send Date object
    });

    if (!response.ok) throw new Error('Failed to export product');

    const updatedProduct = await response.json(); // Get the updated product with the exported date and quantity
    const newTotalPrice = (updatedProduct.costPerPiece || 0) * (updatedProduct.exportedQuantity || 0);
    setProducts(products.map((product) =>
      product._id === id ? { ...updatedProduct, totalPrice: newTotalPrice } : product
    ));
  } catch (error) {
    console.error('Error exporting product:', error);
    alert('Error exporting product: ' + error.message);
  }
};
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      // Remove the deleted product from the state
      setProducts(products.filter(product => product._id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  }
};

const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilter({ ...filter, [name]: value });
};

const handleFilter = async () => {
  let url = `http://localhost:5001/api/products?`;
  if (filter.field && filter.value) {
    url += `${filter.field}=${filter.value}`; // Build query string with selected filter field and value
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch filtered products');
    const data = await response.json();
    const updatedProducts = data.map(prod => ({
      ...prod,
      totalPrice: (prod.costPerPiece || 0) * (prod.exportedQuantity || 0),
      importedDate: formatDate(prod.importedDate), // Format imported date
      exportedDate: prod.exportedDate ? formatDate(prod.exportedDate) : null, // Format exported date
    }));
    setProducts(updatedProducts); // Update product list with filtered products
  } catch (error) {
    console.error('Error filtering products:', error);
  }
};

const handleClearFilter = () => {
  setFilter({ field: '', value: '' }); // Clear the filter
  fetchProducts(); // Reset to all products
};

const filteredProducts = () => {
  // Check if the filter field is set
  if (!filter.field || !filter.value) {
    return products; // Return all products if no filter is set
  }

  // Log the filter values for debugging
  console.log("Current Filter:", filter);

  // Convert the filter value to Date object for comparison
  const filterValueDate = (filter.field === 'importedDate' || filter.field === 'exportedDate')
    ? new Date(filter.value.split('-').reverse().join('-')) // Convert from DD-MM-YYYY to YYYY-MM-DD
    : null;

  return products.filter(product => {
    // Log product information for debugging
    console.log("Product Info:", product);

    if (filter.field === 'importedDate' || filter.field === 'exportedDate') {
      // Check date comparison
      const productDate = new Date(product[filter.field]);
      return filterValueDate && productDate.toDateString() === filterValueDate.toDateString(); // Compare dates
    }
    return product[filter.field] === filter.value; // Compare other fields
  });
};
  const totalPriceDuringFilter = () => {
    return filteredProducts().reduce((acc, prod) => acc + (prod.totalPrice || 0), 0);
  };

  return (
    <div className="stock-management">
      <h2>Stock Management</h2>
      <div className="product-form" align="center">
        <form align="center">
          Select product:
          <select onChange={handleProductSelect}>
            <option value="">--Select Product--</option>
            <option>T-shirt</option>
            <option>3/4th Pant</option>
            <option>Jerkin</option>
           
            <option>Other</option>
          </select>
          {showCustomName && (
            <>
              <br />
              Custom Product Name:
              <input
                type="text"
                name="name"
                placeholder="Enter Custom Name"
                value={product.name}
                onChange={handleInputChange}
              />
            </>
          )}
          <br />
          Product ID:
          <input
            type="text"
            name="productId"
            placeholder="Product ID"
            value={product.productId}
            onChange={handleInputChange}
          />
          
          <br />
          Cost per Piece:
          <input
            type="number"
            name="costPerPiece"
            placeholder="Cost per Piece"
            value={product.costPerPiece}
            onChange={handleInputChange}
          />
          <br />
          Imported Quantity:
          <input
            type="number"
            name="importedQuantity"
            placeholder="Imported Quantity"
            value={product.importedQuantity}
            onChange={handleInputChange}
          />
          <br />
          Imported Date:
          <input
            type="date"
            name="importedDate"
            value={product.importedDate}
            onChange={handleInputChange}
          />
          <br />
          <button type="button" onClick={handleImport} style={{color: "black"}}>Import Product</button>
        </form>
      </div>
      {/* Filter Section */}
      <div className="filter-section">
  <select name="field" onChange={handleFilterChange}>
    <option value="">Select Filter</option>
    <option value="productId">Product ID</option>
    <option value="name">Product Name</option>
    <option value="importedDate">Imported Date</option>
    <option value="exportedDate">Exported Date</option>
  </select>

  {/* Show dropdown for productId and name */}
  {filter.field === 'productId' && (
    <select name="value" onChange={handleFilterChange}>
      <option value="">Select Product ID</option>
      {productIds.map((id) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </select>
  )}

  {filter.field === 'name' && (
    <select name="value" onChange={handleFilterChange}>
      <option value="">Select Product Name</option>
      {productNames.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  )}

  {/* Use date input for date fields */}
  {filter.field === 'importedDate' || filter.field === 'exportedDate' ? (
    <input
      type="date"
      name="value"
      placeholder="Filter Value"
      onChange={handleFilterChange}
    />
  ) : null}

  {/* Filter and clear filter buttons */}
  <button type="button" onClick={handleFilter} className='button-space' style={{color: "black"}}>Filter</button>     
  <button type="button" onClick={handleClearFilter} style={{color: "black"}}>Clear Filter</button>
</div>


      {/* Display the filtered products in a table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Cost per Piece</th>
            <th>Imported Quantity</th>
            <th>Imported Date(DD/MM/YYYY)</th>
            <th>Exported Quantity</th>
            <th>Exported Date(DD/MM/YYYY)</th>
            <th>Balance Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts().map((product) => (
            <tr key={product._id}>
              <td>{product.productId}</td>
              <td>{product.name}</td>
              <td>{product.costPerPiece}</td>
              <td>{product.importedQuantity}</td>
              <td>{product.importedDate}</td>
              <td>{product.exportedQuantity || 0}</td>
              <td>{product.exportedDate || 'N/A'}</td>
              <td>{product.importedQuantity - (product.exportedQuantity || 0)}</td>
              <td>{product.totalPrice || 0}</td><td>
                <button onClick={() => handleExport(product._id)}>Export</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="summary-section">
        <p>Total Imported Goods: {importedGoods}</p>
        <p>Total Exported Goods: {exportedGoods}</p>
        <p>Balance Goods: {balanceGoods}</p>
        <p>Total Amount: {totalPriceDuringFilter()}</p> {/* Show total price during filter */}
      </div>
    {/* Show total price during filter */}
<div>
  {/* Pass totalAmount to GSTCalculation */}
  <GSTCalculation totalAmount={totalPriceDuringFilter()} />
</div>
    </div>
  );
};

export default StockManagement;


