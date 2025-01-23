import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css'; // Učitajte CSS

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError('');
    setGeneralError('');

    if (!email.endsWith('@outlook.com')) {
      setEmailError('Email mora biti u formatu @outlook.com');
      return;
    }

    if (password !== confirmPassword) {
      setGeneralError('Lozinke se ne podudaraju');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        const loginResponse = await axios.post('http://localhost:5000/login', { email, password });
        localStorage.setItem('token', loginResponse.data.token);
        navigate('/Dashboard');
      } else {
        setGeneralError(response.data.error);
      }
    } catch (error) {
      setGeneralError(error.response ? error.response.data.error : 'Došlo je do pogreške. Pokušajte ponovo.');
    }
  };

  return (
    <div className="signup">
      <div className="overlay">
        <h1 className="content"> <h1>Registracija</h1></h1>
        <br></br>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Korisničko ime:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group">
            <label>Lozinka:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Potvrda lozinke:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {generalError && <p className="error-message">{generalError}</p>}
          <button className="option-btn" type="submit">
            Registriraj se
          </button>
        </form>
        <p>
          <p style={{ color: '#333' }}>Već imate račun?</p>
          <Link to="/SignIn" style={{ color: '#D7A49A' }}><p>Prijavite se ovdje</p></Link>.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
