import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Crud from './Component/Crud';
import Home from './Component/Home';
import Task from './Component/Task';
import Category from './Component/Category';
import SubCategory from './Component/SubCategory';
import Product from './Component/Product';














function App() {
  return (
    <>

      <Routes>

        {/* Admin-Side */}
        <Route path='/' element={<Home />} ></Route>
        <Route path='/Crud' element={<Crud />}></Route>
        <Route path='/Task' element={<Task />}></Route>
        <Route path='/Category' element={<Category />}></Route>
        <Route path='/SubCategory' element={<SubCategory />}></Route>
        <Route path='/Product' element={<Product />}></Route>








      </Routes>

    </>
  );
}

export default App