import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css'; // Ako je u src/styles/


function MainPage() {
  const navigate = useNavigate();

  // Navigacija na Signup ili Signin stranicu
  const goToSignup = () => {
    navigate('/signup');
  };

  const goToSignin = () => {
    navigate('/signin');
  };

  return (
    <div className="main-page">
      <div className="overlay">
        <div className="content">
          <h1>Welcome to Our App</h1>
          <p>Join us and start managing your tasks today</p>
          <div className="buttons">
            <button className="btn" onClick={goToSignup}>Sign Up</button>
            <button className="btn" onClick={goToSignin}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;