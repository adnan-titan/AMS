import React, { useEffect, useState } from 'react';
import './index.css';
import TextField from '../TextField';
import axios from 'axios';
import HomeButton from '../HomeButton';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'
const HistoryPopup = (props) => {
    const [deviceUniqueId, setDeviceUniqueId] = useState("");
    const [historyData, setHistoryData] = useState([]);
    const { role, setIsLoggedIn } = useContext(LoginContext)



    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e)
        props.onSubmit()
        // props.(false)

    }
    const handleOnClick = (e) => {
        props.setShowHistoryPopup(false);

    };
    const header = {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    }
    // const axiosInstance = axios.create({
    //     baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
    //     // timeout: 1000,
    //     // headers: {'X-Custom-Header': 'foobar'}
    // });

    const axiosInstance = axios.create({
        //baseURL: 'http://localhost:8080/',
        //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
        // timeout: 1000,
        // headers: {'X-Custom-Header': 'foobar'}
        baseURL: 'http://10.0.46.75:8080/',
    });


    useEffect(() => {

        setDeviceUniqueId(props.selectedRow.device_unique_id)
        const device_unique_id = props.selectedRow.device_unique_id
        const employeeId = localStorage.getItem("employee_id");

        if (deviceUniqueId !== "") {
            console.log(deviceUniqueId)

            axiosInstance.get(`asset/getDeviceHistory/${device_unique_id}`, header).then(data => {
                console.log({ data })
                setHistoryData(data.data);
                console.log(historyData)

            }).catch(e => {
                console.log({ e })
                if (e.response.status !== 200) {
                    setIsLoggedIn(false)
                    sessionStorage.removeItem("token")
                }
            })
        }
        console.log(historyData)

    }, [deviceUniqueId])
    return (
        <div>


            <div className="add-details-page form-centre text-center">

                <button className='close-button' onClick={handleOnClick}> X </button>
                <form onSubmit={handleSubmit}>
                    {/* <label>
                Number of Rows:


            </label> */}

                    <label className='history-label'>Device History</label>
                    <br />
                    <div>
                        {/* <div className="textfieldContainer">
                            {/* <label className='login-label'>Product</label>
                        <input className='login-input'
                            type="text"
                            // value={employeeId}
                            // onChange={handleEmployeeIdChange}
                            required
                        /> 
                            <TextField className="textField" disabled label="Product" placeholder={props.selectedRow.asset_name} />
                            <TextField className="textField" disabled label="Vendor" placeholder={props.selectedRow.partner} />
                            <TextField className="textField" disabled label="Sample" placeholder={props.selectedRow.sample_type
                            } />
                            <TextField className="textField" disabled label="MacId" placeholder={props.selectedRow.device_unique_id} />




                        </div> */}
                        <div className='centerDiv'>
                            <div className='fillTextField'>Product: {props.selectedRow.asset_name}</div>
                            <div className='fillTextField'>Vendor: {props.selectedRow.partner}</div>
                            <div className='fillTextField'>Sample: {props.selectedRow.sample_type}</div>
                            <div className='fillTextField'>MacId: {props.selectedRow.device_unique_id}</div>
                        </div>
                        <br />
                        <div className='form'>

                        </div>
                    </div>
                    <div>
                        <table >
                            <thead>
                                <tr className=''>
                                    <th>Employee Id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>assigned date</th>
                                    <th>return date </th>

                                </tr>
                            </thead>
                            <div className='history-table-data'>
                                <tbody>
                                    {historyData.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.assignedEmployeeId.employee_id}</td>
                                            <td>{row.assignedEmployeeId.employee_name}</td>
                                            <td>{row.assignedEmployeeId.email}</td>
                                            <td>{row.assignedDate}</td>
                                            <td>{row.returnedDate}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </div>
                        </table>
                    </div>

                </form>
            </div>
        </div>
    )
}


export default HistoryPopup;