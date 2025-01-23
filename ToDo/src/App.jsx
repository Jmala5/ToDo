//import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import SignUp from './page/SignUp.jsx'
import SignIn from './page/SignIn.jsx'
import './App.css'
import TodoList from './page/ToDoList.jsx'; // Import nove komponente
import MainPage from './page/MainPage.jsx';
import Schedule from './page/Schedule.jsx'; //anteino
import Notes from './page/Notes.jsx';
import GoalsForTheDay from './page/GoalsForTheDay.jsx';
import Dashboard from './page/Dashboard.jsx';

function App() {
  return (
   
    <Router>
   <>
     
       <Routes>
       
     
         <Route exact path="/SignUp" element={<SignUp />} />
         <Route exact path="/SignIn" element={<SignIn />} />
         <Route exact path="/TodoList" element={<TodoList />} /> {/* Nova ruta */}
         <Route exact path="/Schedule" element={<Schedule/>} /> 
         <Route exact path="/Notes" element={<Notes/>} /> 
         <Route exact path="/GoalsForTheDay" element={<GoalsForTheDay/>} />
         <Route path="/Dashboard" element={<Dashboard />} />
         <Route exact path="/" element={<MainPage />} />
         
       </Routes>
      
     </>
    </Router>
   
 )
  
}

export default App
