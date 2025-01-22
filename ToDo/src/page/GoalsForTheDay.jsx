import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/GoalsForTheDay.css'; // Importiraj stilove

function GoalsForTheDay() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/goals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
      } catch (err) {
        console.error('Error fetching goals:', err);
      }
    };

    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    if (newGoal.trim() === '') {
      setError('Goal cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/goals',
        { text: newGoal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([...goals, response.data]);
      setNewGoal('');
      setError('');
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const toggleGoalCompletion = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/goals/${goalId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === goalId ? { ...goal, completed: response.data.completed } : goal
        )
      );
    } catch (err) {
      console.error('Failed to toggle goal completion:', err);
    }
  };

  const navigateBack = () => navigate('/Dashboard');

  return (
    <div className="goals-page">
      <div className="goals-overlay">
        <h2 className="goals-header">Ciljevi dana</h2>
        <ul className="goals-list">
          {goals.map((goal) => (
            <li
              key={goal._id}
              className={`goals-item ${goal.completed ? 'completed' : ''}`}
              onClick={() => toggleGoalCompletion(goal._id)}
            >
              <span>{goal.text}</span>
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoalCompletion(goal._id)}
              />
            </li>
          ))}
        </ul>
        <div className="add-goal-form">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Dodaj novi cilj"
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleAddGoal}>Dodaj</button>
        </div>
        <button onClick={navigateBack} className="previous-page-button">
          🠄 Back
        </button>
      </div>
    </div>
  );
}

export default GoalsForTheDay;

