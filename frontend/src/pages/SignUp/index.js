import React, { useState } from 'react';
import './index.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css'






const SignUp = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');

    const handleEmployeeIdChange = (e) => {
        setEmployeeId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const navigate = useNavigate();

    // const axiosInstance = axios.create({
    //     baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
    //     // timeout: 1000,
    //     // headers: {'X-Custom-Header': 'foobar'}
    // });
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/',
        //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
        // timeout: 1000,
        // headers: {'X-Custom-Header': 'foobar'}
    });

    const handleSubmit = (e) => {
        console.log("handlesubmit called")
        e.preventDefault()
        const body = {
            employee_id: employeeId,
            password: password

        }


        axiosInstance.post(`user/checkUser`, body).then(resp => {
            console.log({ resp })
            if (resp.status === 201) {
                navigate('/userDetail');

            }
            else {
                alert("user already exist")
                navigate('/')

            }



            // 

        }).catch(e => {
            alert("user already exist")
            navigate('/')
        })
        // navigate('/userDetail');
    }


    localStorage.setItem("employee_id", employeeId);
    localStorage.setItem("password", password);
    return (
        <>
            <body>
                <section className={`${styles.container}`}>
                    <div className={`${styles['login-container']}`}>
                        <div className={`${styles.circle} ${styles['circle-one']}`}></div>
                        <div className={`${styles['form-container']}`}>
                            {/* <img src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png" alt="illustration" class="illustration" /> */}
                            <h1 className={`${styles.opacity}`}>CREATE ACCOUNT</h1>
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="EMPLOYEEID" onChange={handleEmployeeIdChange}
                                    required />
                                <input type="password" placeholder="CREATE PASSWORD" onChange={handlePasswordChange}
                                    required />
                                <button className={`${styles.opacity}`}>CREATE</button>
                            </form>
                            <div className={`${styles['register-forget']} ${styles.opacity}`}>
                            </div>
                        </div>
                        <div className={`${styles.circle} ${styles['circle-two']}`}></div>
                    </div>
                    <div className={`${styles['theme-btn-container']}`}></div>
                </section>
            </body>
        </>








        // <>
        //     <div className='user-logo'>

        //     </div>

        //     <div className={styles['center-div-container']}>

        //         <form className={` ${styles["loginpage-container"]}  ${styles["text-center"]}`} onSubmit={handleSubmit}>
        //             <h2 className={` ${styles["h1"]}`}> Create Account</h2>

        //             <div className={styles["form-group form-center"]}>
        //                 <label className={styles['login-label']}>EmployeeId</label>
        //                 <input className={styles['login-input']}
        //                     type="text"
        //                     value={employeeId}
        //                     onChange={handleEmployeeIdChange}
        //                     required
        //                 />
        //             </div>
        //             <div className={styles["form-group form-center"]}>
        //                 <label className={styles['login-label']}>create password</label>
        //                 <input className={styles['login-input']}
        //                     type="password"
        //                     value={password}
        //                     onChange={handlePasswordChange}
        //                     required
        //                 />
        //             </div>

        //             <button type="submit" className={styles["btn-login"]}>sign Up</button>
        //         </form>

        //     </div>

        // </>
    );
};

export default SignUp;
