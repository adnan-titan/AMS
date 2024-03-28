import React, { useContext, useState } from 'react';
import './index.module.css'; // Import custom CSS file for styling
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import user from './user.png'
import axios from 'axios';
import styles from './index.module.css'
import useAuth from '../../useAuth';
import LoginContext from '../../utils/LoginContext';



const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const { _, setIsLoggedIn, role, setRole } = useContext(LoginContext)
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const url = "http://localhost:8080/user/getManager?employee_id=1774990&name=adnan"
  const urlParams = url.split("?")[1]
  console.log({ urlParams })
  setRole("")
  const params = new URLSearchParams(urlParams)
  for (const [key, value] of params) {
    console.log({ key, value }) // {key: 'term', value: 'pizza'} {key: 'location', value: 'Bangalore'}
  }
  console.log({ params, size: params.size })


  const navigate = useNavigate();
  const handleSignUpOnClick = (e) => {
    navigate('/signUp')
  }
  const handleForgotOnClick = (e) => {
    navigate('/Forgot')
  }
  // const axiosInstance = axios.create({
  //   baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
  // });
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
    const body = {
      employee_id: employeeId,
      password: password

    }
    console.log(body)

    axiosInstance.post('user/signIn', body).then(resp => {
      console.log(body);

      const responseData = resp.data;
      console.log(responseData);
      sessionStorage.setItem("token", responseData.token);
      sessionStorage.setItem("role", responseData.role)
      localStorage.setItem("employee_id", employeeId);
      setRole(responseData.role)
      console.log(sessionStorage.getItem("token"))
      setIsLoggedIn(true)
      //console.log(isLoggedIn);
      navigate('/userView');

    }).catch(e => {
      alert("Invalid Credential")
      navigate('/')
    }
    )
  };

  return (
    <>
      <div className={styles['user-logo']}>
        <img src={user} width="50" height="60" padding="30px" alt="Login" />
      </div>
      <div  >
        <h2></h2>
        <div className={styles['center-div-container']}>
          <form className={` ${styles["loginpage-container"]}  ${styles["text-center"]}`} onSubmit={handleSubmit}>
            <label>Sign into your account</label>
            <div className={styles["form-group form-center"]}>
              <label className={styles['login-label']}>EmployeeId</label>
              <input className={styles['login-input']}
                type="text"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                required
              />
            </div>
            <div className={`{${styles["form-group"]} ${styles["form-centre"]}`}>
              <label className={styles["login-label"]}>Password</label>
              <input className={styles["login-input"]}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button type="submit" className={styles["btn-login"]}>Login</button>
            <div className={styles['div-signup-forgot-margin']}>
              <button className={`${styles["signup-forgot-margin"]} ${styles["signup-forgot-margin-button"]}`} onClick={handleSignUpOnClick}>Sign Up</button>
              <button className={styles['signup-forgot-margin-button']}>forgot password</button>
            </div>
            <h3 className={styles["policy"]}>Terms of use. Privacy policy</h3>


          </form>

        </div>
      </div>
    </>
  );
};

export default LoginPage;
