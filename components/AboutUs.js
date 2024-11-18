import React from 'react';
import ImageContentGrid from './ImageContentGrid';
import './AboutUs.css'; // Import the CSS file for styling

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <header className="about-us-header">
                <h1>About Us</h1>
                <p>
                    Welcome to AAA Tex, a leading textile management company! We are dedicated to helping businesses streamline their textile management through efficiency and innovation.
                </p>
            </header>
            <section className="about-us-team">
                <h2>Meet Our Team</h2>
                <p>
                    The driving force behind AAA Tex is our team of industry veterans who bring a wealth of experience and passion to the table. Our founders are dedicated to maintaining the highest standards in textile management.
                </p>
                <ImageContentGrid /> {/* This will display your grid of images */}
                <p>
                    Together, they are committed to building a future where AAA Tex continues to innovate and set benchmarks for excellence in textile management.
                </p>
            </section>


            <section className="about-us-mission">
                <h2>Our Mission</h2>
                <p>
                    Our mission is to provide a seamless experience in textile management by leveraging cutting-edge technology and delivering user-friendly solutions that meet the industry's growing needs.
                </p>
            </section>

            <section className="about-us-vision">
                <h2>Our Vision</h2>
                <p>
                    We envision a future where textile management is fully automated and sustainable, reducing waste and maximizing productivity for companies worldwide.
                </p>
            </section>

            <section className="about-us-values">
                <h2>Our Values</h2>
                <ul>
                    <li><strong>Innovation:</strong> Continuously improving and adopting the latest technologies.</li>
                    <li><strong>Integrity:</strong> Being transparent and accountable in everything we do.</li>
                    <li><strong>Sustainability:</strong> Promoting eco-friendly practices in textile management.</li>
                    <li><strong>Customer-Centric:</strong> Prioritizing our clients' needs and ensuring satisfaction.</li>
                </ul>
            </section>

           
            <section className="about-us-footer">
                <p>For more information, please contact us at <a href="aaatex@gmail.com">aaatex@gmail.com</a>.</p>
                <p>Follow us on <a href="https://twitter.com/aaatex" target="_blank" rel="noopener noreferrer">Twitter</a>, <a href="https://facebook.com/aaatex" target="_blank" rel="noopener noreferrer">Facebook</a>, and <a href="https://linkedin.com/company/aaatex" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
            </section>
        </div>
    );
};

export default AboutUs;
