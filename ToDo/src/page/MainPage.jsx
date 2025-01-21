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
          <h1>Dobrodošli u ToDo aplikaciju</h1>
          <p>Pridružite nam se i počnite upravljati svojim zadacima već danas!</p>
          <div className="buttons">
            <button className="btn" onClick={goToSignup}>Registracija</button>
            <button className="btn" onClick={goToSignin}>Prijava</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;