import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Koristimo useNavigate umjesto useHistory

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const navigate = useNavigate(); // Koristimo navigate za preusmjeravanje

  // Dohvati zadatke s backenda
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Dodaj zadatak
  const addTask = async () => {
    if (task.trim() === '') {
      alert('You must write something!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/tasks', 
        { name: task }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      setTasks([...tasks, response.data]);
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Izbriši zadatak
  const removeTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tasks/${id}`, { 
        headers: { Authorization: `Bearer ${token}` }, 
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Funkcija za preusmjeravanje na sljedeću stranicu
  const navigateToNextPage = () => {
    navigate('/next-page'); // Putanja za sljedeću stranicu
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>To-Do List</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
      />
      <button onClick={addTask} style={{ padding: '0.5rem' }}>Add Task</button>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {tasks.map((t) => (
          <li
            key={t._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            {t.name}
            <button onClick={() => removeTask(t._id)} style={{ marginLeft: '1rem', cursor: 'pointer' }}>
              ×
            </button>
          </li>
        ))}
      </ul>

      {/* Strelica za navigaciju u desnom donjem kutu */}
      <button 
        onClick={navigateToNextPage}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '30px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          padding: '15px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        ➔
      </button>
    </div>
  );
}

export default TodoList;
