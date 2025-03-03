import React from 'react';
import './Home.css'; // Import the CSS file


const Home = () => {
    return (
        <div className="home-container">
            {/* <Crud /> */}

            <button className="home-button"><a href="/Crud">Crud</a></button>
            <button className="home-button"><a href="/Task">Task</a></button>
            <button className='home-button' ><a href='/Category'>Category</a></button>
            <button className='home-button' ><a href='/SubCategory'>SubCategory</a></button>
            <button className='home-button'> <a href='/Product'>Product</a></button>


        </div >
    );
}

export default Home;