import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const features = [
  {
    image: 'stock.png',
    title: 'Stock Management',
    description: 'Keep track of your textile inventory effortlessly.',
    route: '/stock-management',
  },
  {
    image: 'emp.jpeg',
    title: 'Employee Attendance',
    description: 'Manage employee attendance with ease.',
    route: '/employee-attendance',
  },
  {
    image: 'salary.jpg',
    title: 'Salary Calculation',
    description: 'Automated salary calculations for your staff.',
    route: '/salary-calculation',
  },
  {
    image: 'gst.jpg',
    title: 'GST Calculations',
    description: 'Accurate GST calculations for all your products.',
    route: '/gst-calculations',
  },
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  const handleFeatureClick = () => {
    const { route } = features[currentIndex];
    navigate(route); // Navigate to the appropriate route
  };

  const { image, title, description } = features[currentIndex];

  return (
    <div className="home">
      <section className="intro">
        <h1>Welcome to AAA Tex</h1>
        <p>Your one-stop solution for managing textile inventory and operations.</p>
      </section>
      <section className="carousel">
        <h2>Features</h2>
        <div className="carousel-container">
          <button className="carousel-button" onClick={handlePrevious}>‹</button>
          <div className="carousel-item" onClick={handleFeatureClick}>
            <img src={image} alt={title} />
            <div className="carousel-text">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
          <button className="carousel-button" onClick={handleNext}>›</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
