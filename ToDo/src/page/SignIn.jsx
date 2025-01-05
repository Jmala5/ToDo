import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setErrorMessage('');
      navigate('/ToDoList'); 
    } catch (err) {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div>
      <nav style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Home</a>
          <a href="/SignUp" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Sign Up</a>
        </div>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', backgroundColor: '#2c2c2c', color: '#fff' }}>
        <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#3a3a3a', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
            <button type="submit" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
