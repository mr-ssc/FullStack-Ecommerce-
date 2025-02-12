import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Crud from './Component/Crud';
import Home from './Component/Home';
import Task from './Component/Task';












function App() {
  return (
    <>

      <Routes>


        <Route path='/' element={<Home />} ></Route>
        <Route path='/Crud' element={<Crud />}></Route>
        <Route path='/Task' element={<Task />}></Route>

      </Routes>

    </>
  );
}

export default App