import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CenterContainer from '../../components/CenterContainer'
import "./index.css"
import _ from 'lodash'
import { useNavigate } from 'react-router-dom';
import distribution from './distribution.png'
import DeviceDetails from '../../components/DeviceDetails';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'

function DistributeDevices() {
    const initialFilterValues = {
        partner: "",
        deviceName: "",
        inventoryId: "",
        requiredQuantity: 0
        // availableQuantity:""
    }
    const [tableData, setTableData] = useState([])
    const [safeData, setSafeData] = useState([])
    const [manager, setManager] = useState("")
    const [deviceDetails, setDeviceDetails] = useState([])
    const [availabelQuantity, setAvailableQuantity] = useState(0)
    const [filters, setFilters] = useState(initialFilterValues)
    const [showDetailsForm, setShowDetailsForm] = useState(false)
    const partners = Object.keys(_.groupBy(safeData, "partner"))
    const deviceNames = Object.keys(_.groupBy(tableData, "asset_name"))
    const groupedInventories = _.groupBy(tableData, "inventory_id")
    console.log({ groupedInventories })
    const inventoryIds = Object.keys(groupedInventories)
    const { role, setIsLoggedIn } = useContext(LoginContext)

    console.log({ partners, deviceNames })
    const handleChange = (e, fieldValue) => {
        setFilters(prevData => ({ ...prevData, [fieldValue]: e.target.value }))
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

    const header = {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    }



    useEffect(() => {
        const employee_id = localStorage.getItem("employee_id");

        axiosInstance.get("asset/getAllInventory", header).then(data => {
            console.log({ data })
            setTableData(data.data)
            setSafeData(data.data)
        }).catch(e => {
            console.log({ e })
            if (e.response.status !== 200) {
                setIsLoggedIn(false)
                sessionStorage.removeItem("token")
            }
        })


    }, [])
    useEffect(() => {
        setTableData(prevData => {
            const partnerFilteredData = safeData.filter(obj => filters.partner === "" ? obj : obj.partner === filters.partner)
            const deviceFilteredData = partnerFilteredData.filter(obj => filters.deviceName === "" ? obj : obj.asset_name === filters.deviceName)
            const inventoryIdFilteredData = deviceFilteredData.filter(obj => filters.requiredQuantity === 0 ? obj : obj.quantity_available >= filters.requiredQuantity)
            console.log({ inventoryIdFilteredData })
            return inventoryIdFilteredData
        })
        setAvailableQuantity(tableData.find(o => o.inventory_id === parseInt(filters.inventoryId, 10))?.quantity_available)
    }, [filters])

    const [employeeId, setEmployeeId] = useState('');

    const handleBlur = (e) => {
        axiosInstance.get(`user/getManager?employee_id=${employeeId}`, header).then(data => {
            console.log(data.data)
            setManager(data.data)
        }).catch(e => {
            console.log("some error")
        })

    };
    const navigate = useNavigate();
    const handleEmployeeIdChange = (e) => {
        setEmployeeId(e.target.value);
    };



    const handleSubmit = (e) => {
        console.log("handlesubmit called")
        e.preventDefault()
        const body = {
            employee: {
                employee_id: employeeId
            },
            asset_inventory: {
                inventory_id: filters.inventoryId
            },
            quantity: filters.requiredQuantity

        }
        console.log(filters);
        console.log(tableData)
        if (filters.partner !== initialFilterValues.partner && filters.deviceName !== initialFilterValues.deviceName &&
            filters.requiredQuantity !== initialFilterValues.requiredQuantity &&
            filters.inventoryId !== initialFilterValues.inventoryId && handleTableDataCheck(tableData, filters.inventoryId, filters.requiredQuantity)) {
            axiosInstance.post("distribution/assignAsset", body, header).then(resp => {
                console.log({ resp })
                localStorage.setItem("distribution_id", resp.data)
                console.log("inside");
                navigate('/home')
                // 

            }).catch(e => navigate('/'))
        } else {
            console.log("In else");
        }
    }
    const handleOnClick = (e) => {
        setShowDetailsForm(true)
    };

    const handleTableDataCheck = (tableData, id, availabelQuantity) => {
        let currTableData = tableData.filter((currTable) => currTable.inventory_id == id);
        return (currTableData[0].quantity_available >= availabelQuantity);
    }





    return (
        <div>
            <div className='distribution-logo distribution'> Distribution
                <img src={distribution} width="50" height="60" padding="30px" alt="Distribution" />
            </div>


            <div className='form-div'>
                <form onSubmit={handleSubmit}>
                    <div className='form-display'>

                        <div className='input-field'>
                            <label>employeeId:</label>
                            <input className='text-field' type="text"
                                onChange={handleEmployeeIdChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className='input-scrolldown'>
                            <label>partner:</label>
                            <select onChange={(e) => handleChange(e, "partner")}>
                                <option key="Default" value="">Partner</option>
                                {(partners || []).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='input-scrolldown'>
                            <label>Asset Name:</label>
                            <select onChange={(e) => handleChange(e, "deviceName")}>
                                <option key="Default" value="">Device Name</option>
                                {(deviceNames || []).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='input-field'>
                            <label>Required Quantity:</label>
                            <input className='text-field' type="number" onChange={(e) => handleChange(e, "requiredQuantity")}
                            />
                            {/* <button className="add-details-button" onClick={handleOnClick}> Details </button> */}

                        </div>


                        <div className='input-field'>
                            <label>Inventory Id:</label>
                            <select onChange={(e) => handleChange(e, "inventoryId")}>
                                <option className='text-field' key="Default" value="">Inventory</option>
                                {(inventoryIds || []).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className='input-field'>
                            <label>available Quantity:</label>
                            <input className='text-field' type="text"
                                value={availabelQuantity}
                            />
                        </div>

                        <div className='input-field'>
                            <label>Reporting Manager:</label>
                            <input className='text-field'
                                type="text"
                                value={manager}
                            />

                        </div>
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>

            </div>
            {/* </CenterContainer> */}
            <div >
                {showDetailsForm && <DeviceDetails setDeviceDetails={setDeviceDetails} setShowDetailsForm={setShowDetailsForm} numberOfRows={filters.requiredQuantity} />}

            </div>


        </div>
    );








}
export default DistributeDevices