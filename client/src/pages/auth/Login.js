import React, { useState } from 'react';
import { BiLogIn } from 'react-icons/bi';
import Card from '../../components/card/Card';
import styles from './auth.module.scss';
import { Link } from 'react-router-dom';
import PasswordInput from '../../components/passwordInput/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = () => {};

  const loginUser = () => {};
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#999" />
          </div>
          <h2>Login</h2>
          <div className="--flex-center">
            <button className="--btn --btn-google">Login with Google</button>
          </div>
          <br />
          <p className="--text-center --fw-bold">or</p>

          <form onSubmit={loginUser}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />

            <PasswordInput 
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
            />
            <button type="submit" 
            className="--btn --btn-primary --btn-block">
              Login
            </button>
          </form>
          <Link to="/forgot">Forgot password</Link>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Don't have an account? &nbsp;</p>
            <Link to="/register">Register</Link>
          </span>
          <div className=""></div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
