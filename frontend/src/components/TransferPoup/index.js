import React, { useEffect, useState } from 'react';
import './index.css';
import TextField from '../TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css'
import SuggestionList from '../SuggestionList';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'


const TransferPopup = (props) => {
    const navigate = useNavigate();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [listOfEmployeeId, setListOfEmployeeId] = useState([]);
    const currentEmployeeId = localStorage.getItem("employee_id");
    const { role, setIsLoggedIn } = useContext(LoginContext)

    const [employeeDetails, setEmployeeDetails] = useState({
        employeeId: "",
        employeeName: "",
        employeeEmail: "",
        requiredQuantity: 0

    })

    const empIdNullOrEmpty = employeeDetails.employeeId !== "" && !employeeDetails.employeeEmail
    const sameEmpId = employeeDetails.employeeId == currentEmployeeId
    const errorLabel = empIdNullOrEmpty ? "Employee doesn't exist" : sameEmpId ? "you cannot transfer to yourself" : ""
    const showError = empIdNullOrEmpty || sameEmpId






    const handleSubmit = (e) => {
        if (showError)
            return
        const senderEmployeeId = localStorage.getItem("employee_id");
        e.preventDefault()
        const body = {
            current_user_employee_id: senderEmployeeId,
            transfer_user_employee_id: employeeDetails.employeeId,
            device_unique_id: props.selectedRow.device_unique_id

        }
        axiosInstance.post("asset/transferAsset", body, header).then(resp => {
            console.log(body);
            props.setShowTransferPopup(false);

            //navigate('/home')
            // 

        }).catch(e =>

            navigate('/'));

        // props.(false)

    }
    useEffect(() => {
        axiosInstance.get("user/getAllEmployeeId", header).then(response => {
            const { data } = response
            setListOfEmployeeId(data.filter(emp => emp.role === "USER"));
        }).catch(e => {
            console.log({ e })
            if (e.response.status !== 200) {
                setIsLoggedIn(false)
                sessionStorage.removeItem("token")
            }
        })
    }, [])



    // props.(false)


    const handleOnClick = (e) => {
        props.setShowTransferPopup(false);

    };

    const handleChange = (e, i) => {
        props.setDeviceDetails(prev => ({
            ...prev,
            [`device${i}`]: e.target.value
        }))
    }



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
    const queryParams = {
        employee_id: parseInt(employeeDetails.employeeId)

    };
    const conditionOptions = [
        "Good",
        "Non-working",
        "Bricked"
    ]

    // ("/endpoint?employee_id="+empploye)

    useEffect(() => {
        console.log(employeeDetails);
        if (employeeDetails.employeeId && !isNaN(employeeDetails.employeeId)) {
            axiosInstance.get("user/getEmployeeDetail/" + employeeDetails.employeeId, header).then(response => {
                console.log("data", { response })
                const { data } = response
                setEmployeeDetails(prev => ({
                    ...prev,
                    employeeName: data?.employee_name || "",
                    employeeEmail: data?.email || ""
                }))
            })
        }

    }, [employeeDetails.employeeId])

    const handleEmployeeDetails = (e, fieldValue, empId) => {
        console.log("setting empId ", empId, fieldValue)
        fieldValue === "employeeId" ? setShowSuggestions(true) : setShowSuggestions(false);

        setEmployeeDetails(prev => ({
            ...prev,
            employeeName: fieldValue === "employeeId" ? "" : prev.employeeName,
            employeeEmail: fieldValue === "employeeId" ? "" : prev.employeeEmail,
            [fieldValue]: empId || e.target.value
        }))

    }
    const handleOnClickSuggestion = (e, fieldValue) => {
        //handleEmployeeDetails(e, fieldValue);
        setShowSuggestions(false);

    }
    const handleOnBlur = (e, fieldValue, employeeId) => {
        //setShowSuggestions(false);
    }

    const handleOnClickEmployeeId = (e) => {

        setShowSuggestions(true);

    }
    const positionStyles = {
        position: 'absolute',
        width: '195px',
        top: "192px"
    };





    return (
        <div>


            <div className="add-details-page form-centre text-center">
                <button className='close-button' onClick={handleOnClick}> X </button>
                <form onSubmit={handleSubmit}>
                    {/* <label>
                Number of Rows:

            </label> */}
                    <label className='label'>Transfer</label>
                    <div>
                        <div className="">
                            {/* <label className='login-label'>Product</label>
                        <input className='login-input'
                            type="text"
                            // value={employeeId}
                            // onChange={handleEmployeeIdChange}
                            required
                        /> */}
                            <div className='centerDiv'>
                                <div className='fillTextField'>Product: {props.selectedRow.asset_name}</div>
                                <div className='fillTextField'>Vendor: {props.selectedRow.partner}</div>
                                <div className='fillTextField'>Sample: {props.selectedRow.sample_type}</div>
                                <div className='fillTextField'>MacId: {props.selectedRow.device_unique_id}</div>
                            </div>
                            {/* <TextField className="textField" disabled label="Product" placeholder={props.selectedRow.asset_name} /> */}
                            {/* <TextField className="textField" disabled label="Vendor" placeholder={props.selectedRow.partner} />
                            <TextField className="textField" disabled label="Sample" placeholder={props.selectedRow.sample_type
                            } />
                            <TextField className="textField" disabled label="MacId" placeholder={props.selectedRow.device_unique_id} /> */}
                            <div className='centerDiv'>
                                <TextField
                                    className="textField empIdInput suggestion"
                                    showError={showError}
                                    errorLabel={errorLabel}
                                    label="Transfer To"
                                    onChange={(e) => handleEmployeeDetails(e, "employeeId")}
                                    onFocus={() => setShowSuggestions(true)}
                                    onClick={(e) => handleOnBlur}
                                    type="text"
                                    value={employeeDetails.employeeId}
                                    required

                                />
                                <SuggestionList positionStyles={positionStyles} options={listOfEmployeeId} searchedTerm={employeeDetails.employeeId} setEmployeeDetails={setEmployeeDetails}
                                    showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions} />
                            </div>
                            <div className>
                                <div className='fillTextField'>Name: {employeeDetails.employeeName}</div>
                                <div className='fillTextField'>Email: {employeeDetails.employeeEmail}</div>
                            </div>
                            <div className='centerDiv'>

                                <TextField
                                    className="textField empIdInput"
                                    label="comments"
                                    onChange={(e) => handleEmployeeDetails(e, "comment")}
                                    onClick={(e) => handleOnClickSuggestion(e, "condition")}
                                    type="text"
                                    required
                                />
                            </div>



                        </div>
                        <br />
                        <div className='form'>

                        </div>
                    </div>


                    <button type="submit" className="btn-login" disabled={showError}>Transfer</button>

                </form>
            </div >
        </div >
    );

}
export default TransferPopup