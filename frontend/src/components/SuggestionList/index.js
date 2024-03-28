import React, { useState } from 'react'
import axios from 'axios';
import './index.css';


const SuggestionList = (props) => {
    const { options } = props
    // console.log({ options })
    // const filteredOptions = options.filter(o => o.role === isFromReturn ? "ADMIN" : "USER")
    // console.log({ filteredOptions })
    const header = {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    }
    // console.log(props.options)
    // console.log(props.showSuggestions)
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
    const handleOnClick = (e, fieldValue) => {
        console.log("in suggestion somponent ", fieldValue, e.target.value);

        props.setEmployeeDetails(prev => ({
            ...prev,
            [fieldValue]: e.target.value
        }))

        props.setShowSuggestions(prev => fieldValue === "employeeId" ? !prev : false)
        //console.log(props.showSuggestions)
    }



    const filteredEmployees = options.filter((employee) => {
        // console.log(employee, employeeDetails.employeeId)
        return String(employee.employee_id).toLowerCase().includes((String(props.searchedTerm)).toLowerCase()) || String(employee.employee_name.toLowerCase()).includes(String(props.searchedTerm).toLowerCase())
    }
    );
    // console.log(filteredEmployees);
    return (
        <>
            {props.showSuggestions && (<ul style={props.positionStyles} className='list-suggestion ' >
                {filteredEmployees.map((employee, index) => (
                    <div>
                        <li value={employee.employee_id} onClick={(e) => handleOnClick(e, "employeeId")} key={index}> {employee.employee_name} ({employee.employee_id})</li>
                        <hr />
                    </div>
                ))}
            </ul>)}
        </>
    )


}
export default SuggestionList;