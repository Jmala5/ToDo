import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ToDoList.css'; 

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const addTask = async () => {
    if (task.trim() === '') {
      setError('Task cannot be empty');
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
      setError('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

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

  const navigateBack = () => navigate('/Dashboard');

  return (
    <div className="todo-page">
      <div className="todo-overlay">
        <h2 className="todo-header">To-Do List</h2>
        <ul className="todo-list">
          {tasks.map((t) => (
            <li key={t._id} className="todo-item">
              <span>{t.name}</span>
              <button onClick={() => removeTask(t._id)} className="delete-task">
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="add-task-form">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Unesi zadatak"
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={addTask}>Dodaj zadatak</button>
        </div>
        

        <button onClick={navigateBack} className="previous-page-button">
        🠄
      </button>
      </div>
    </div>
  );
}

export default TodoList;
