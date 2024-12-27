//import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import SignUp from './page/SignUp.jsx'
import SignIn from './page/SignIn.jsx'
import './App.css'

function App() {
  return (
   
    <Router>
   <>
     
       <Routes>
       
     
         <Route
         exact
         path="/SignUp"
         element={<SignUp />} />
         <Route exact path="/SignIn" element={<SignIn />} />
         {/* <Route exact path="/MainPage" element={<MainPage />} /> */}
         
       </Routes>
      
     </>
    </Router>
   
 )
  
}

export default App
