import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Crud from './Component/Crud';












function App() {
  return (
    <>

      <Routes>


        <Route path='/' element={<Crud />}></Route>

      </Routes>

    </>
  );
}

export default App