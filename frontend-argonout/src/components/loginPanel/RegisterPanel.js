import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './loginPanel.css'; // Import pliku CSS dla stylizacji

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '' // Dodano pole confirmPassword
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Hasła nie są takie same!");
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
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Błąd podczas rejestracji. Spróbuj ponownie.');
        }
    };

    return (
        <div className="main-container">
            <div className="login-right">
                <h3>
                    <span className="welcome-text">Witaj w </span>
                    <span className="argonout-text">Argonout!</span>
                </h3>
                <h7>Zarejestruj się, aby kontynuować</h7>
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">Imię</label>
                        <input
                            className="text-input"
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Imię"
                            value={formData.firstName}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Nazwisko</label>
                        <input
                            className="text-input"
                            id="surname"
                            name="surname"
                            type="text"
                            placeholder="Nazwisko"
                            value={formData.surname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Nazwa użytkownika</label>
                        <input
                            className="text-input"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Nazwa użytkownika"
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
                        <label htmlFor="password">Hasło</label>
                        <input
                            className="text-input"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Hasło"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Powtórz hasło</label>
                        <input
                            className="text-input"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Powtórz hasło"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="submit-btn" type="submit">Zarejestruj</button>
                    <div className="another-option-btn">
                        Masz już konto?&nbsp;
                        <Link to="/api/auth/login" className="login-register-link">Zaloguj się!</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
