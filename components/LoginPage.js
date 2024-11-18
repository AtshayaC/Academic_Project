import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const admins = [
        "chenniappanaaa@gmail.com",
        "dhandapaniaaa@gmail.com",
        "eswaramoorthyaaa@gmail.com"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post('http://localhost:5004/api/login', { email, password });

            if (res.data) {
                if (admins.includes(email)) {
                    alert("Welcome Admin! You can edit details.");
                    // Redirect to admin dashboard
                    navigate('/stock-management');
                } else {
                    alert("Welcome Employee! You can only view your details.");
                    // Redirect to employee dashboard
                    navigate('/');
                }
            } else {
                setError("Invalid credentials or user not registered.");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message); // Server's error message
            } else {
                setError("Error logging in. Please try again later.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {error && <div className="login-error">{error}</div>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" style={{color: "black"}}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
