import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Dodajte odgovarajući CSS

function Dashboard() {
  const navigate = useNavigate();

  // Funkcije za navigaciju na različite stranice
  const goToNotes = () => navigate('/Notes');
  const goToGoals = () => navigate('/GoalsForTheDay');
  const goToSchedule = () => navigate('/Schedule');
  const goToTodo = () => navigate('/ToDoList');

  return (
    <div className="dashboard">
     <div className='overlay'>
      <div className="content">
      <h1>Dobrodošli u izbornik</h1>
      <p>Odaberite opciju:</p>
      <div className="options">
        <button className="option-btn" onClick={goToNotes}>Bilješke</button>
        <button className="option-btn" onClick={goToGoals}>Ciljevi dana</button>
        <button className="option-btn" onClick={goToSchedule}>Raspored</button>
        <button className="option-btn" onClick={goToTodo}>To-Do lista</button>
      </div>
     </div>
    </div>
</div>
  );
}

export default Dashboard;
