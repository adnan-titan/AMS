import React, { useEffect, useState } from 'react';
import './index.css';
import TextField from '../TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import PopUp from '../../pages/Popup';
import SuggestionList from '../SuggestionList';
import { useContext } from 'react'
import LoginContext from '../../utils/LoginContext';


const DistributePopup = (props) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [listOfEmployeeId, setListOfEmployeeId] = useState([]);
    const currentEmployeeId = localStorage.getItem("employee_id");
    const { role, setIsLoggedIn } = useContext(LoginContext)


    const [showDistributionConfirmPopup, setShowDistributionConfirmPopup] = useState(false);


    //const token = sessionStorage.getItem("token");
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
        baseURL: 'http://localhost:8080/',
        // timeout: 1000,
        // headers: {'X-Custom-Header': 'foobar'}
    });
    useEffect(() => {
        console.log("to get all employee");
        axiosInstance.get("user/getAllEmployeeId", header).then(response => {
            const { data } = response
            setListOfEmployeeId(data);
        }).catch(e => {
            console.log({ e })
            if (e.response.status !== 200) {
                setIsLoggedIn(false)
                sessionStorage.removeItem("token")
            }
        })
    }, [])


    const handleOnClick = (e) => {
        props.setShowDistributionPopup(false);

    };



    const handleChange = (e, i) => {
        props.setDeviceDetails(prev => ({
            ...prev,
            [`device${i}`]: e.target.value
        }))
    }
    const [employeeDetails, setEmployeeDetails] = useState({
        employeeId: "",
        employeeName: "",
        employeeEmail: "",
        requiredQuantity: 0

    })

    const empIdNullOrEmpty = employeeDetails.employeeId !== "" && !employeeDetails.employeeEmail
    const sameEmpId = employeeDetails.employeeId == currentEmployeeId
    const errorLabel = empIdNullOrEmpty ? "Employee doesn't exist" : sameEmpId ? "you cannot distribute to yourself" : ""
    const showError = empIdNullOrEmpty || sameEmpId
    const navigate = useNavigate();

    const handleSubmit = (e) => {

        e.preventDefault()
        if (showError)
            return
        console.log(e)
        const body = {
            asset_distribution_id: props.selectedRow.asset_distribution_id,
            inventory_id: props.selectedRow.inventory_id,
            employee_id: employeeDetails.employeeId,
            distribution_quantity: employeeDetails.requiredQuantity

        }
        console.log(body);

        if (employeeDetails.requiredQuantity <= props.selectedRow.distribution_quantity) {
            console.log("inside")
            axiosInstance.post("distribution/distributeAsset", body, header).then(resp => {
                console.log(body);
                setShowDistributionConfirmPopup(true);
                // props.setShowDistributionPopup(false);
                // navigate('/userView')

            }).catch(e => {
                console.log("ERROR")
                navigate('/')
            })

        }

    }

    // props.(false)






    const queryParams = {
        employee_id: parseInt(employeeDetails.employeeId)

    };
    // ("/endpoint?employee_id="+empploye)
    // in place of queryparams
    //+ employeeDetails.employeeId

    useEffect(() => {
        console.log("employee details", { queryParams }, employeeDetails);
        // console.log(header);
        if (employeeDetails.employeeId && !isNaN(employeeDetails.employeeId)) {
            console.log("inside", employeeDetails, queryParams, header);
            axiosInstance.get("user/getEmployeeDetail/" + employeeDetails.employeeId, header).then(response => {
                console.log("data", { response })
                const { data } = response
                setEmployeeDetails(prev => ({
                    ...prev,
                    employeeName: data?.employee_name || "",
                    employeeEmail: data?.email || ""
                }))
            }).catch(e =>
                console.log(e)
            );

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

    const handleYesNoOnClick = (e) => {
        // const clickedButton = e.target.innerText;
        // navigate('/userView');
        setShowDistributionConfirmPopup(false)
        props.setShowDistributionPopup(false)
    }

    const handleOnClickSuggestion = (e, fieldValue) => {
        handleEmployeeDetails(e, fieldValue);
        setShowSuggestions(prev => fieldValue === "employeeId" ? !prev : false)

    }
    const handleOnBlur = (e) => {
        console.log(e);
        console.log('onblure has called ');
        //setShowSuggestions(false);
    }

    const handleOnClickEmployeeId = (e) => {

        setShowSuggestions(false);

    }
    const handleKeyDown = (e, fieldValue) => {
        if (e.key === 'Enter') {
            setEmployeeDetails(prev => ({
                ...prev,
                [fieldValue]: e.target.value
            }))

            setShowSuggestions(prev => fieldValue === "employeeId" ? !prev : false)
            // If the "Enter" key is pressed, select the value
            //  setSelectedValue(inputValue);
        }
    };
    const positionStyles = {
        // position: 'absolute',
        // left: "41%",
        // top: "-50px",
        // width: '206px',
        // top: "192px"

        position: 'absolute',
        left: '43.5%',
        top: '192px',
        width: '202px'
    };




    return (
        <div>
            <div className="add-details-page f
            orm-centre text-center">
                <button className='close-button' onClick={handleOnClick}> X </button>
                <form onSubmit={handleSubmit}>
                    {/* <label>
                Number of Rows:

            </label> */}
                    <label className='label'>Distribution</label>
                    <div>
                        <div className="">
                            {/* <label className='login-label'>Product</label>
                        <input className='login-input'
                            type="text"
                            // value={employeeId}
                            // onChange={handleEmployeeIdChange}
                            required
                        /> */}
                            {/* <TextField className="textField" disabled label="Product" placeholder={props.selectedRow.asset_name} />
                            <TextField className="textField" disabled label="Vendor" placeholder={props.selectedRow.partner} />
                            <TextField className="textField" disabled label="Sample" placeholder={props.selectedRow.sample_type
                            } />
                            <TextField className="textField" disabled label="Availabale Quantity" placeholder={props.selectedRow.distribution_quantity} /> */}
                            <div className='centerDiv'>
                                <div className='fillTextField'>Product: {props.selectedRow.asset_name}</div>
                                <div className='fillTextField'>Vendor: {props.selectedRow.partner}</div>
                                <div className='fillTextField'>Sample: {props.selectedRow.sample_type}</div>
                                <div className='fillTextField'>Availabale Quantity: {props.selectedRow.distribution_quantity}</div>
                            </div>
                            <div>
                                <TextField
                                    className="textField empIdInput suggestion"
                                    showError={showError}
                                    errorLabel={errorLabel}
                                    label="Employee Id"
                                    onChange={(e) => handleEmployeeDetails(e, "employeeId")}
                                    onKeyDown={(e) => handleKeyDown(e, "employeeId")}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={handleOnBlur}
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
                                    showError={employeeDetails.requiredQuantity > props.selectedRow.distribution_quantity}
                                    errorLabel="required quantity can not be greater than available quantity"
                                    label="Required Quantity"
                                    onChange={(e) => handleEmployeeDetails(e, "requiredQuantity")}
                                    onClick={(e) => handleOnClickSuggestion(e, "condition")}
                                    type="number"
                                    min="1"
                                />
                            </div>
                        </div>
                        <br />
                        <div className='form'>

                        </div>
                    </div>
                    <br />
                    <br />
                    <button type="submit" disabled={showError} className="btn-login">distribute</button>

                </form>
            </div>
            <PopUp visible={showDistributionConfirmPopup} setVisible={setShowDistributionConfirmPopup}>
                <div>
                    <div className='already-mac-added-popup'>Devices has been distributed to {employeeDetails.employeeName}</div>
                    <br />
                    <br />
                    <div className='add-mac-go-back'>Do you want to Distribute more?
                        <br />
                    </div>
                    <br />
                    <br />
                    <div className='mac-pop-yes-no'>
                        <button className='yes' onClick={handleYesNoOnClick}>Yes</button>
                        <button className='no' onClick={handleYesNoOnClick}>No</button>
                    </div>
                    <br />
                    <br />
                </div>
            </PopUp>
        </div>
    );

}
export default DistributePopup;