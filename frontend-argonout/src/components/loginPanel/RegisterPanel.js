import React from 'react';
import { Link } from 'react-router-dom';
import './loginPanel.css'; // Importujemy plik CSS dla stylizacji

function RegisterPage() {
    return (
        <>
            <div className="main-container">
                {/* <div className="header">
                    <p>Gra Terenowa</p>
                </div> */}
                <div className="signInForm">
                    <h3>
                        <span className="welcome-text">Welcome to </span>
                        <span className="argonout-text">Argonout Game!</span>
                    </h3>
                    <h5>Register to continue</h5>
                    <form className="form-container">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                className="text-input"
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
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
