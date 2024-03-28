import React, { useEffect, useState } from 'react';
import './index.css';
import TextField from '../TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuggestionList from '../SuggestionList';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'
// import Select from 'react-select';


const ReturnPopup = (props) => {
    const [listOfEmployeeId, setListOfEmployeeId] = useState([]);
    const currentEmployeeId = localStorage.getItem("employee_id");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { role, setIsLoggedIn } = useContext(LoginContext)




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
        //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
        // timeout: 1000,
        // headers: {'X-Custom-Header': 'foobar'}
    });
    const [employeeDetails, setEmployeeDetails] = useState({
        employeeId: "",
        employeeName: "",
        employeeEmail: "",
        comment: "",
        condition: "GOOD"

    })
    const empIdNullOrEmpty = employeeDetails.employeeId !== "" && !employeeDetails.employeeEmail
    const sameEmpId = employeeDetails.employeeId == currentEmployeeId
    const errorLabel = empIdNullOrEmpty ? "Employee doesn't exist" : sameEmpId ? "you cannot return to yourself" : ""
    const showError = empIdNullOrEmpty || sameEmpId
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        if (showError)
            return
        e.preventDefault()
        const senderEmployeeId = localStorage.getItem("employee_id");

        const body = {
            senderEmployeeId: {
                employee_id: senderEmployeeId
            },
            receiverEmployeeId: {
                employee_id: employeeDetails.employeeId
            },
            partner: props.selectedRow.partner,
            sample: props.selectedRow.sample_type,
            device_unique_id: props.selectedRow.device_unique_id,
            comment: employeeDetails.comment,
            status: employeeDetails.condition
        }
        axiosInstance.post("asset/returnAsset", body, header).then(resp => {
            console.log(body);
            props.setShowReturnPopup(false);
            //navigate('/home')
            // 

        }).catch(e => {
            console.log({ e })
            if (e.response.status !== 200) {
                setIsLoggedIn(false)
                sessionStorage.removeItem("token")
            }
        })

        // props.(false)

    }
    const handleOnClick = (e) => {
        props.setShowReturnPopup(false);

    };

    const handleChange = (e, i) => {
        setEmployeeDetails(prev => ({
            ...prev,
            [i]: e.target.value
        }))
    }




    const queryParams = {
        employee_id: parseInt(employeeDetails.employeeId)
    };
    const conditionOptions = [
        "GOOD",
        "NOT WORKING",
        "BROKEN"
    ]
    const [deviceUniqueId, setDeviceUniqueId] = useState("");

    // ("/endpoint?employee_id="+empploye)

    useEffect(() => {
        axiosInstance.get("user/getAllEmployeeId", header).then(response => {
            const { data } = response
            setListOfEmployeeId(data.filter(employee => employee.role === "ADMIN"));
        })
    }, [])



    useEffect(() => {
        console.log(employeeDetails, !isNaN(employeeDetails.employeeId));
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
        console.log(fieldValue, e.target.value);
        fieldValue === "employeeId" ? setShowSuggestions(true) : setShowSuggestions(false);

        setEmployeeDetails(prev => ({
            ...prev,
            employeeName: fieldValue === "employeeId" ? "" : prev.employeeName,
            employeeEmail: fieldValue === "employeeId" ? "" : prev.employeeEmail,
            [fieldValue]: empId || e.target.value
            //[fieldValue]: e.target.value
        }))

    }
    const filteredEmployees = listOfEmployeeId.filter((employee) => {
        // console.log(employee, employeeDetails.employeeId)
        return String(employee).includes(employeeDetails.employeeId)
    }
    );

    const handleOnClickSuggestion = (e) => {

        setShowSuggestions(false);
        // setShowSuggestions(prev => fieldValue === "employeeId" ? !prev : false)
    }
    const handleOnBlur = (e) => {

        e.preventDefault();
        console.log("onblur")
        // setShowSuggestions(false);
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
        position: 'absolute',
        left: "43%",
        top: "-50px",
        width: '206px',
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
                    <label className='label'>Return</label>
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
                            <TextField className="textField" disabled label="MacId" placeholder={props.selectedRow.device_unique_id} /> */}
                            <div className='centerDiv'>
                                <div className='fillTextField'>Product: {props.selectedRow.asset_name}</div>
                                <div className='fillTextField'>Vendor: {props.selectedRow.partner}</div>
                                <div className='fillTextField'>Sample: {props.selectedRow.sample_type}</div>
                                <div className='fillTextField'>Mac Address: {props.selectedRow.device_unique_id}</div>
                            </div>

                            <div >
                                <TextField
                                    className="textField empIdInput suggestion"
                                    showError={showError}
                                    errorLabel={errorLabel}
                                    label="Returned To"

                                    onChange={(e) => handleEmployeeDetails(e, "employeeId")}
                                    // onClick={(e) => { handleOnClickSuggestion(e, "employeeId") }}
                                    onKeyDown={(e) => handleKeyDown(e, "employeeId")}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={handleOnBlur}
                                    type="text"
                                    value={employeeDetails.employeeId}
                                    required

                                />
                                {/* {showSuggestions && filteredEmployees.length > 1 && (<ul className='list-suggestion' >
                                    {filteredEmployees.map((employee, index) => (
                                        <div>
                                            <li value={employee} onClick={(e) => handleOnClickSuggestion(e, "employeeId")} key={index}>{employee}</li>
                                            <hr />
                                        </div>
                                    ))}
                                </ul>)} */}
                                <SuggestionList positionStyles={positionStyles} options={listOfEmployeeId} searchedTerm={employeeDetails.employeeId} setEmployeeDetails={setEmployeeDetails}
                                    showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions} />

                            </div>


                            {/* <Select placeholder="" onChange={(e) => handleEmployeeDetails(e, "employeeId", true)} className='textField empIdInput' options={listOfEmployeeId.map(empId => ({ value: empId, label: empId }))} /> */}

                            <div className>
                                <div className='fillTextField'>Name: {employeeDetails.employeeName}</div>
                                <div className='fillTextField email-position'>Email: {employeeDetails.employeeEmail}</div>
                            </div>

                            <div className="">
                                <h6 className="h6">Condition</h6>
                                <select className="return-drop-down"
                                    type="text"
                                    value={employeeDetails.condition}
                                    onChange={(e) => handleEmployeeDetails(e, "condition")}
                                    onClick={(e) => handleOnClickSuggestion(e)}
                                    required
                                >
                                    {
                                        conditionOptions.map(option => <option value={option}>{option}</option>)
                                    }

                                </select>
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


                    <button type="submit" className="return-button" disabled={showError}>return</button>

                </form>
            </div>
        </div>
    );

}
export default ReturnPopup