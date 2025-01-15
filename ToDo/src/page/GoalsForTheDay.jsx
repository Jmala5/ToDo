import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



function GoalsForTheDay(){

  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/goals',{
          headers: { Authorization: `Bearer ${token}` },});
        setGoals(response.data);
      } catch (err) {
        console.error('Error fetching goals:', err);
      }
    };

    fetchGoals();
  }, []);
  
  
  //dodaj novi goal
  const handleAddGoal = async() => {
    if (newGoal.trim() === '') {
      setError('Goal cannot be empty');
      return;
    }
    try{
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/goals',
      { text: newGoal},
      { headers: { Authorization: `Bearer ${token}` }});
    
    setGoals([...goals, response.data]);
    setNewGoal('');
    setError('');
      }catch(err){
        console.error('error adding goal', err);
      }
  };

  //Ispunjenost goal-a
  const toggleGoalCompletion = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/goals/${goalId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ažćuriraj stanje goala
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === goalId ? { ...goal, completed: response.data.completed } : goal
        )
      );
    } catch (err) {
      console.error('Failed to toggle goal completion:', err);
    }
  };
  
// Preusmjeravanje na sljedeću stranicu
const navigateToNextPage = () => navigate('/Notes');

// Preusmjeravanje na prethodnu stranicu
const navigateBack = () => navigate('/Schedule');
 

return (
  <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', color: '#333' }}>
    <h2>Goals for the Day</h2>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {goals.map((goal) => (
        <li
          key={goal._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            backgroundColor: goal.completed ? '#d4edda' : '#f8d7da',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => toggleGoalCompletion(goal._id)}
        >
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={() => toggleGoalCompletion(goal._id)}
            style={{ marginRight: '10px' }}
          />
          <span
            style={{
              textDecoration: goal.completed ? 'line-through' : 'none',
            }}
          >
            {goal.text}
          </span>
        </li>
      ))}
    </ul>
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        placeholder="Add a new goal"
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '100%',
        }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleAddGoal}
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#28a745',
          color: 'white',
          fontWeight: 'bold',
          marginTop: '10px',
          width: '100%',
        }}
      >
        Add Goal
      </button>
    </div>
      {/* Strelica za navigaciju */}
      <button onClick={navigateToNextPage} className="next-page-button">
        🠆
      </button>
      <button onClick={navigateBack} className="previous-page-button">
        🠄
      </button>
    </div>
);
};
export default GoalsForTheDay;
