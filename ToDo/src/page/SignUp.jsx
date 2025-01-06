import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        console.log('Registracija uspješna:', response.data);

        // Automatically log the user in after successful signup
        const loginResponse = await axios.post('http://localhost:5000/login', { email, password });
        localStorage.setItem('token', loginResponse.data.token);
        navigate('/ToDoList');
      } else {
        console.error('Greška:', response.data.error);
        setGeneralError(response.data.error);
      }
    } catch (error) {
      console.error('Greška:', error.response ? error.response.data : error.message);
      setGeneralError(error.response ? error.response.data.error : 'Došlo je do pogreške. Pokušajte ponovo.');
    }
  };

  return (
    <div>
      <nav style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Home</Link>
            <Link to="/SignIn" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Sign In</Link>
          </p>
        </div>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', backgroundColor: '#2c2c2c', color: '#fff' }}>
        <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#3a3a3a', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Korisničko ime:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Lozinka:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Potvrda lozinke:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            {generalError && <p className="error-message">{generalError}</p>}
            <button type="submit" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
              Registriraj se
            </button>
          </form>
          <p>
            Već imate račun? <Link to="/SignIn" style={{ color: '#4CAF50' }}>Prijavite se ovdje</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
