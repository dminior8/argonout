import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './loginPanel.css'; // Importujemy plik CSS dla stylizacji

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Different passwords");
            return;
        }

        const dataToSend = {
            username: formData.username,
            email: formData.email,
            firstName: formData.firstName,
            surname: formData.surname,
            password: formData.password
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                alert('User registered successfully!');
                navigate('/api/auth/login');
            } else {
                // Obsłuż błąd
                const errorData = await response.json();
                alert(`Błąd: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error during register!');
        }
    };

    return (
        <>
            <div className="main-container">
                <div className="signInForm">
                    <h3>
                        <span className="welcome-text">Welcome to </span>
                        <span className="argonout-text">Argonout Game!</span>
                    </h3>
                    <h5>Register to continue</h5>
                    <form className="form-container" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                className="text-input"
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="surname">Surname</label>
                            <input
                                className="text-input"
                                id="surname"
                                name="surname"
                                type="text"
                                placeholder="Surname"
                                value={formData.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                className="text-input"
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                className="text-input"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                className="text-input"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className="text-input"
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <button className="submit-btn" type="submit">Register</button>
                        <div className="another-option-btn">
                            Already have an account?&nbsp;
                            <Link to="/api/auth/login" className="login-link">Sign in!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
