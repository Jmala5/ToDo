import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Schedule.css'; // Importiranje CSS-a

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/schedules', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedule(response.data);
      } catch (error) {
        console.error('Greška u dohvaćanju rasporeda', error);
      }
    };
  
    fetchSchedule();
    initializeScheduleData();
  }, []); // Ovdje samo jednom učitava podatke pri inicijalnom renderiranju
  
  


  // Inicijalizacija rasporeda (sati od 7:00 do 22:00)
  const initializeScheduleData = () => {
    const hours = Array.from({ length: 16 }, (_, i) => {
      const time = `${i + 7 < 10 ? '0' : ''}${i + 7}:00`;
      return { time, description: '', _id: null };
    });
    setScheduleData(hours);
  };

  // Centralizirana funkcija za rukovanje greškama
  const handleError = (error, message) => {
    console.error(message, error);
    alert(message);
  };

  
  // Funkcija za kreiranje novog zadatka
  const createZadatak = async (zadatakData, token) => {
    try {
      const response = await axios.post('http://localhost:5000/schedules', zadatakData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedule(prevSchedule => [...prevSchedule, response.data]);

      // Ažurirajte scheduleData nakon što ste dodali novi zadatak
      setScheduleData(prevData => 
        prevData.map(item => 
          item.time === zadatakData.time ? { ...item, description: zadatakData.description, _id: response.data._id } : item
        )
      );
    } catch (error) {
      handleError(error, 'Greška pri dodavanju novog zadatka');
    }
  };

  

  // Spremi ili ažuriraj zadatak
  const handleZadatak = async (time, description) => {
    if (!description) return;

    const token = localStorage.getItem('token');
    
    const zadatakData = { time, description };
    console.log('Zadatak Data:', zadatakData);

    try {
      const existingZadatak = schedule.find(zadatak => zadatak.time === time);
      if (existingZadatak) {
        await updateZadatak(existingZadatak._id, zadatakData, token);
      } else {
        await createZadatak(zadatakData, token);
      }
    } catch (error) {
      handleError(error, 'Greška u spremanju zadatka');
    }
  };


  // Funkcija za ažuriranje postojećeg zadatka
  const updateZadatak = async (zadatakId, zadatakData, token) => {
    console.log('Ažuriranje zadatka sa ID-jem:', zadatakId); // Dodajte ovo za debugiranje
    try {
      const response = await axios.put(`http://localhost:5000/schedules/${zadatakId}`, zadatakData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedule(prevSchedule =>
        prevSchedule.map(zadatak => zadatak._id === zadatakId ? response.data : zadatak)
      );
      setScheduleData(prevData => 
        prevData.map(item => 
          item.time === zadatakData.time ? { ...item, description: zadatakData.description, _id: response.data._id } : item
        )
      );
    } catch (error) {
      handleError(error, 'Greška pri ažuriranju zadatka');
    }
  };
  



  
// Izbriši zadatak
const handleDeleteZadatak = async (zadatakId) => {
    const token = localStorage.getItem('token');
    try {
      // Izbrisati zadatak s poslužitelja
      await axios.delete(`http://localhost:5000/schedule/${zadatakId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Ažurirati schedule listu nakon brisanja zadatka
      setSchedule(prevSchedule => prevSchedule.filter(zadatak => zadatak._id !== zadatakId));
  
      // Ažurirati scheduleData listu nakon brisanja zadatka
      setScheduleData(prevData => prevData.map(item => {
        // Ako zadatak ima _id koji odgovara obrisanom zadatku, očisti description
        return item._id === zadatakId ? { ...item, description: '', _id: null } : item;
      }));
    } catch (error) {
      handleError(error, 'Greška pri brisanju zadatka');
    }
  };
  
// Preusmjeravanje na sljedeću stranicu
const navigateToNextPage = () => navigate('/GoalsForTheDay');

// Preusmjeravanje na prethodnu stranicu
const navigateBack = () => navigate('/TodoList');

  return (
    <div className="schedule-container">
      <h1>Schedule for Today</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map(item => {
            const task = schedule.find(task => task.time === item.time);
            return (
              <tr key={item.time}>
                <td>{item.time}</td>
                <td>
                <input
                    type="text"
                    value={scheduleData.find((dataItem) => dataItem.time === item.time)?.description || ''}
                    onChange={(e) => {
                      const newDescription = e.target.value;
                      setScheduleData(scheduleData.map((dataItem) =>
                        dataItem.time === item.time ? { ...dataItem, description: newDescription } : dataItem
                      ));
                    }}
                    placeholder={task ? task.description : ''}
                    />




                </td>
                <td>
                  <button onClick={() => handleZadatak(item.time, item.description)} title="Save">💾</button>
                  {task && task._id && (
                    <button onClick={() => handleDeleteZadatak(task._id)} title="Delete">🗑️</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Strelica za navigaciju */}
      <button onClick={navigateToNextPage} className="next-page-button">
        🠆
      </button>
      <button onClick={navigateBack} className="previous-page-button">
        🠄
      </button>


    </div>
  );
}

export default Schedule;
