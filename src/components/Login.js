import React, { useState, useContext } from 'react';
import './Login.css';
import { UserContext } from '../UserContext';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pseudodaten für Dozenten
    const validEmail = 'dozent@example.com';
    const validPassword = 'password';
    const validName = 'Dr. Mustermann';

    if (email === validEmail && password === validPassword) {
      setUser({ name: validName, email });
      onLogin({ name: validName, email });
    } else {
      alert('Ungültige Anmeldedaten');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="login-input"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="login-input"
      />
      <button type="submit" className="login-button">Login</button>
    </form>
  );
}

export default Login;
