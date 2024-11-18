// ImageContentGrid.js
import React from 'react';
import './ImageContentGrid.css'; // Import the CSS file for styling

const items = [
  {
    image: 'Appa.jpg',
    title: 'Chenniappan K',
    
  },
  {
    image: 'Appa2.jpg',
    title: 'Dhandapani K',
    
  },
  {
    image: 'Appa1.jpg',
    title: 'Eswaramoorthy K',
    
  },
];

const ImageContentGrid = () => {
  return (
    <div className="image-content-grid">
      {items.map((item, index) => (
        <div key={index} className="grid-item">
          <img src={item.image} alt={item.title} />
          <div className="content">
            <h5>{item.title}</h5>
           
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageContentGrid;
