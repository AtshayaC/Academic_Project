import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setResponseMessage('All fields are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5004/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage('Registration successful');
                setTimeout(() => navigate('/LoginPage'), 2000);  // Redirect to login after success
            } else {
                setResponseMessage(data.message);
            }
        } catch (error) {
            setResponseMessage('Server error');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Sign Up</h2>
                <form className="register-form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="register-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="register-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="register-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="register-button" style={{color: "black"}}>Create Account</button>
                </form>
                {responseMessage && (
                    <div className="response-popup">
                        {responseMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
