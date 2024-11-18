import React, { useState } from 'react';

const GSTCalculation = ({ totalAmount }) => {
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmountWithGst, setTotalAmountWithGst] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(18); // Default GST percentage
  const [loading, setLoading] = useState(false);
  const [itemType, setItemType] = useState('cotton'); // Default item type

  const calculateGST = () => {
    let gstRate;

    // Determine the GST rate based on the item type
    if (itemType.toLowerCase() === 'cotton') {
      gstRate = 5; // Example: 5% GST for cotton
    } else if (itemType.toLowerCase() === 'polyester') {
      gstRate = 12; // Example: 12% GST for polyester
    } else {
      console.log('Invalid item type');
      return;
    }

    // Calculate the GST amount only if totalAmount is greater than 0
    if (totalAmount > 0) {
      const gstAmount = (totalAmount * gstRate) / 100;
      const finalAmount = totalAmount + gstAmount;

      setGstAmount(gstAmount);
      setTotalAmountWithGst(finalAmount);
    } else {
      setGstAmount(0);
      setTotalAmountWithGst(0);
    }
  };

  const handleCalculateGst = () => {
    setLoading(true);
    calculateGST();
    setLoading(false);
  };

  return (
    <div className="gst-calculation">
      <h2>GST Calculation</h2>
      <div className="gst-input">
        <label htmlFor="itemType">Item Type:</label>
        <select id="itemType" value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="cotton">Cotton</option>
          <option value="polyester">Polyester</option>
        </select>
      </div>
      <button onClick={handleCalculateGst} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate GST'}
      </button>
      <div className="gst-results">
        <p><strong>Total Amount:</strong> ₹{totalAmount ? totalAmount.toFixed(2) : '0.00'}</p>
        <p><strong>GST Amount:</strong> ₹{gstAmount.toFixed(2)}</p>
        <p><strong>Total Amount with GST:</strong> ₹{totalAmountWithGst.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default GSTCalculation;
