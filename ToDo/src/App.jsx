//import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import SignUp from './page/SignUp.jsx'
import SignIn from './page/SignIn.jsx'
import './App.css'
import TodoList from './page/ToDoList.jsx'; // Import nove komponente
import MainPage from './page/MainPage';
//import NextPage from './NextPage'; //anteino

function App() {
  return (
   
    <Router>
   <>
     
       <Routes>
       
     
         <Route exact path="/SignUp" element={<SignUp />} />
         <Route exact path="/SignIn" element={<SignIn />} />
         <Route exact path="/TodoList" element={<TodoList />} /> {/* Nova ruta */}
         {/*<Route path="/next-page" component={NextPage} />} //anteino */}
         <Route exact path="/" element={<MainPage />} />
         
       </Routes>
      
     </>
    </Router>
   
 )
  
}

export default App
