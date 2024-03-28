import { compact } from "lodash";
import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './index.css'

const ReturnAssetPopUp = (props) => {

    const handleClose = () => {
        props.setRecordUpdateType("")
    }

    const handleChange = (e, fieldValue) => {
        console.log("handling change", fieldValue)
        props.setReturnData(prevData => ({ ...prevData, [fieldValue]: e.target.value }))
    }
    const conditionOptions = [
        "Good",
        "Non-working",
        "Bricked"
    ]


    const navigate = useNavigate();






    return (
        <>
            <div className="pop-container form-centre text-center" >
                <h2></h2>
                <div >
                    <button onClick={handleClose} className="close">close</button>
                    <form onSubmit={props.adnan}>
                        {props.recordUpdateType === "Transfer" && (
                            <div className="form-group form-centre">
                                <h6 className="h6">Transfer To</h6>
                                <input className='login-input'
                                    type="employeeId"
                                    value={props.returnData.transferEmployeeId}
                                    onChange={(e) => handleChange(e, "transferEmployeeId")}
                                    required
                                />
                            </div>)}

                        {(props.recordUpdateType === "Return" &&
                            <><div className="form-group form-centre">
                                <h6 className="h6">conditions</h6>
                                <select className="drop-down"
                                    type="text"
                                    value={props.returnData.condition}
                                    onChange={(e) => handleChange(e, "condition")}
                                    required
                                >
                                    {
                                        conditionOptions.map(option => <option value={option}>{option}</option>)
                                    }

                                </select>
                            </div>

                                <div className="form-group form-centre">
                                    <h6 className="h6">comments</h6>
                                    <input className='login-input'
                                        type="text"
                                        value={props.returnData.comments}
                                        onChange={(e) => handleChange(e, "comments")}
                                        required
                                    />
                                </div>
                            </>)}


                        <button type="submit" className="btn-login" >submit</button>

                    </form>

                </div>
            </div>
            close

        </>
    );
}

export default ReturnAssetPopUp;