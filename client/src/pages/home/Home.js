import React from 'react'
import "./Home.scss";
import loginImg from "../../assets/login.svg"
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
       <section className='container hero'>
            <div className='hero-text'>
                <h2>My Farm</h2>
                <p>we deal with all kind of modern farming products. We provide high quality seeds and seedlings</p>
           <div className='hero-buttons --flex-start'>
            <button className='--btn --btn-danger'>
            <Link to="/register">Register</Link>
            </button>
            <button className='--btn --btn-primary'>
            <Link to="/login">Login</Link>
            </button>

           </div>
            </div>
            <div className='hero-image'>
                <img src={loginImg} alt="auth" />
            </div>
            <div className='hero-text'></div>

       </section>
    </div>
  )
}

export default Home