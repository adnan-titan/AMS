import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import TextField from '../TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PopUp from '../../pages/Popup';
import { uniq } from 'lodash';



const DeviceDetails = (props) => {

    const [deviceUniqueId, setDeviceUniqueId] = useState([]);
    const [showAddMacConfirmPopup, setShowAddMacConfirmPopup] = useState(false)
    const [isScrollable, setIsScrollable] = useState(props.selectedRow.distribution_quantity > 6);
    const [selectedRow, setSelectedRow] = useState([]);
    const [hasduplicates, setHasDuplicates] = useState(false);



    const header = {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    }

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
        console.log(deviceUniqueId)
        e.preventDefault()
        console.log(e)
        e.preventDefault()
        const uniqueDeviceIdArray = Object.values(deviceUniqueId);
        console.log(">> DUPLICATE ENTRIES", uniqueDeviceIdArray, uniq(uniqueDeviceIdArray))
        const body = {
            assetDistribution: {
                distribution_id: props.selectedRow.asset_distribution_id
            },
            device_unique_id: uniqueDeviceIdArray

        }
        if (uniq(uniqueDeviceIdArray).length < uniqueDeviceIdArray.length) {
            setHasDuplicates(true);
            console.log("DUPLICATES");
        } else {
            axiosInstance.post("asset/assetDeviceMapping", body, header).then(resp => {
                console.log(body);
                setShowAddMacConfirmPopup(true);
                props.setShowDetailsForm(false);

                // navigate('/userView')

            }).catch(e =>

                navigate('/'));
        }

        console.log(body);

    }
    const handleOnClick = (e) => {
        /// props.setShowDetailsForm(false)
        props.setShowDetailsForm(false)
    };

    const handleChange = (e, i) => {
        setDeviceUniqueId(prev => ({
            ...prev,
            [i]: e.target.value
        }))
    }

    const handleErrAddMacYesNoOnClick = (e, selectedRow) => {
        const selectedOption = e.target.innerText;
        setShowAddMacConfirmPopup(false);
    }

    useEffect(() => {
        console.log(">> UNIQUE IDS: ", deviceUniqueId)

    }, [deviceUniqueId])

    return (
        <div>

            <div className="add-details-page form-centre text-center">
                <button className='close-button' onClick={handleOnClick}> X </button>
                <form onSubmit={handleSubmit}>
                    <label className="label">Add Mac Address</label>
                    {/* <label>
                Number of Rows:

            </label> */}
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
                            <TextField className="textField" disabled label="Quantity" placeholder={props.selectedRow.distribution_quantity} /> */}



                            <div className='centerDiv'>
                                <div className='fillTextField'>Product: {props.selectedRow.asset_name}</div>
                                <div className='fillTextField'>Vendor: {props.selectedRow.partner}</div>
                                <div className='fillTextField'>Sample: {props.selectedRow.sample_type}</div>
                                <div className='fillTextField'>Quantity: {props.selectedRow.distribution_quantity}</div>
                            </div>

                        </div>
                        <br />
                        <h2 style={{ fontWeight: "bold", marginBottom: 20 }}>Device Unique Number</h2>
                        <div style={{ overflowY: isScrollable ? 'scroll' : 'hidden', maxHeight: '300px' }} className='form'>
                            {Array.from({ length: props.selectedRow.distribution_quantity }, (_, index) => (
                                <div key={index} className='deviceInputDiv'>
                                    <div className="index">#{index + 1}</div>
                                    <Row name={`device${index + 1}`} rowNumber={index + 1} onChange={(e) => handleChange(e, index + 1)} />

                                </div>
                            ))}
                        </div>
                        {hasduplicates && (<div>Duplicate Values</div>)}
                    </div>
                    <button type="submit" className="btn-login">submit</button>

                </form>
            </div>
            <PopUp visible={showAddMacConfirmPopup} setVisible={setShowAddMacConfirmPopup}>
                <div>
                    <div className='already-mac-added-popup'>Devices has mapped to you </div>
                    <br />
                    <br />
                    <div className='add-mac-go-back'>Do you want to add your Mac Address
                        <br />

                    </div>
                    <br />
                    <br />
                    <div className='mac-pop-yes-no'>
                        <button className='yes' onClick={(e) => handleErrAddMacYesNoOnClick(e, selectedRow)}>Yes</button>
                        <button className='no' onClick={(e) => handleErrAddMacYesNoOnClick(e, selectedRow)}>No</button>
                    </div>
                    <br />
                    <br />
                </div>
            </PopUp>
        </div>
    );

}

const Row = (props) => {
    return (
        <div>
            <input style={{ borderRadius: "14px" }} type="text" name={props.name} required {...props} />
        </div>
    )
}
export default DeviceDetails;