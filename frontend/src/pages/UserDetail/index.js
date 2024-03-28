import React, { useState } from 'react';
import './index.css'; // Import custom CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const UserDetail = () => {

    const [employeeDetail, setEmployeeDetail] = useState({
        employeeId: localStorage.getItem("employee_id"),
        employeeName: "",
        employeeEmail: "",
        department: "6",
        doj: "",
        employeeType: "FULL-TIME",
        reportingManager: "MURALI",
        role: "USER"
    })
    console.log(employeeDetail.employeeId);

    const handleChange = (e, fieldValue) => {
        setEmployeeDetail(prevData => ({ ...prevData, [fieldValue]: e.target.value }))
    }
    const roles = [
        "USER",
        "ADMIN",

    ]

    const employeeTypes = [
        "FULL-TIME",
        "CONSULTANT"

    ]

    const departments = [
        {
            label: "DEVELOPER",
            value: "6"
        },
        {
            label: "QA",
            value: "4"
        },
        {
            label: "FIRMWARE",
            value: "5"
        },
        {
            label: "IT",
            value: "7"
        }

    ]

    const managers = [
        "Murali",
        "Manohar",
        "Dilip"

    ]
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
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        console.log("handlesubmit called")
        e.preventDefault();
        const body = {

            employee_id: employeeDetail.employeeId,
            employee_name: employeeDetail.employeeName,
            email: employeeDetail.employeeEmail,
            department: {
                "department_id": employeeDetail.department
            },
            doj: employeeDetail.doj,
            employee_type: employeeDetail.employeeType,
            reporting_manager: employeeDetail.reportingManager,
            roles: [
                {

                    "name": employeeDetail.role

                }
            ],
            password: localStorage.getItem("password")
            //udana hai password

        }

        console.log(body);

        axiosInstance.post(`user/signUp`, body).then(resp => {
            console.log(body);
            console.log({ resp })

            navigate('/')
            // 

        }).catch(e => navigate('/signUp'))
    }
    return (
        <div>
            <div className='main-container'>
                <h1 className='detail-header'>Employee Details</h1>
                <form className="form-container" onSubmit={handleSubmit} >
                    <div className='form-row'>
                        <div>
                            <label className='login-label'>EmployeeId</label>
                            <input className='login-input'
                                // onChange={(e) => handleChange(e, "employeeId")}
                                value={employeeDetail.employeeId}
                                required
                            />
                        </div>
                        <div>
                            <label className='login-label'>Name</label>
                            <input className='login-input'
                                onChange={(e) => handleChange(e, "employeeName")}
                                required
                            />
                        </div>
                        <div>
                            <label className='login-label'>Email</label>
                            <input className='login-input'
                                onChange={(e) => handleChange(e, "employeeEmail")}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div>
                            <label className='login-label'>Department</label>
                            <select className="select-details"
                                type="text"
                                value={employeeDetail.department}
                                onChange={(e) => handleChange(e, "department")}
                                required
                            >
                                {
                                    departments.map(option => <option value={option.value}>{option.label}</option>)
                                }
                            </select>
                        </div>
                        <div>
                            <label className='login-label'>Date of Joining</label>
                            <input className='login-input'
                                type="Date"
                                onChange={(e) => handleChange(e, "doj")}
                                required
                            />
                        </div>
                        <div>
                            <label className='login-label'>Employee Type</label>
                            <select className="select-details"
                                type="text"
                                value={employeeDetail.employeeType}
                                onChange={(e) => handleChange(e, "employeeType")}
                                required
                            >
                                {
                                    employeeTypes.map(option => <option value={option}>{option}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div>
                            <label className='login-label'>Reporting Manager</label>
                            <select className="select-details"
                                type="text"
                                value={employeeDetail.reportingManager}
                                onChange={(e) => handleChange(e, "reportingManager")}
                                required
                            >
                                {
                                    managers.map(option => <option value={option}>{option}</option>)
                                }
                            </select>
                        </div>
                        <div >
                            <label className='login-label'>Role</label>
                            <select className="select-details"
                                type="text"
                                value={employeeDetail.role}
                                onChange={(e) => handleChange(e, "role")}
                                required
                            >
                                {
                                    roles.map(option => <option value={option}>{option}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className='form-row'>
                        <button type="submit" className="btn-submit" >Submit</button>
                    </div>

                </form>
                <div>

                </div>

            </div>



        </div>
    );
}
export default UserDetail