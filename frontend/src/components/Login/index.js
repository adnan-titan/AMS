import axios from 'axios';
import React, { useContext, useState } from 'react';
import './index.module.css';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.css'
import useAuth from '../../useAuth';
import LoginContext from '../../utils/LoginContext';

const Login = () => {
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
        // baseURL: 'http://localhost:8080/',
        baseURL: 'http://10.0.46.75:8080/',
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
            <body>
                <section className={`${styles.container}`}>
                    <div className={`${styles['login-container']}`}>
                        <div className={`${styles.circle} ${styles['circle-one']}`}></div>
                        <div className={`${styles['form-container']}`}>
                            {/* <img src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png" alt="illustration" class="illustration" /> */}
                            <h1 className={`${styles.opacity}`}>LOGIN</h1>
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="USERNAME" onChange={handleEmployeeIdChange}
                                    required />
                                <input type="password" placeholder="PASSWORD" onChange={handlePasswordChange}
                                    required />
                                <button className={`${styles.opacity}`}>SUBMIT</button>
                            </form>
                            <div className={`${styles['register-forget']} ${styles.opacity}`}>
                                <a onClick={handleSignUpOnClick}>REGISTER</a>
                                <a href="">FORGOT PASSWORD</a>
                            </div>
                        </div>
                        <div className={`${styles.circle} ${styles['circle-two']}`}></div>
                    </div>
                    <div className={`${styles['theme-btn-container']}`}></div>
                </section>
            </body>
        </>
    );
}
export default Login;
