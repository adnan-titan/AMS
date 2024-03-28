
import './index.css'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import DeviceDetails from "../../components/DeviceDetails";
import PopUp from '../Popup'
import AddMacPopup from '../AddMacPopup'
import DistributePopup from '../../components/DistributePopup'
import ReturnPopUp from '../../components/ReturnPopup'
import TransferPopup from '../../components/TransferPoup'
import HistoryPopup from '../../components/HistoryPopup'
import _ from 'lodash';
import HomeButton from '../../components/HomeButton'

import { useContext } from 'react'
import LoginContext from '../../utils/LoginContext';

import './index.css';




const UserView = () => {
    const navigate = useNavigate()
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState([])
    const [selectedRow, setSelectedRow] = useState(0)
    const [showAddMacPopup, setShowAddMacPopup] = useState(false);
    const [errDistributionPopup, setErrDistributionPopup] = useState(false);
    const [showDistributionPopup, setShowDistributionPopup] = useState(false);
    const [showReturnPopup, setShowReturnPopup] = useState(false);
    const [showTransferPopup, setShowTransferPopup] = useState(false);
    const [selectedRowValue, setSelectedRowValue] = useState(0)
    const [deviceHistory, setDeviceHistory] = useState([])
    const [showHistoryPoup, setShowHistoryPopup] = useState(false);
    const [quantityChange, SetQuantityChange] = useState(false);

    const [showErrAddMacPopup, setShowErrAddMacPopup] = useState(false);
    const [safeData, setSafeData] = useState([]);
    const { role, setIsLoggedIn } = useContext(LoginContext)

    const [filters, setFilters] = useState({
        partner: "",
        deviceName: "",
        sampleType: "",

    })
    const partners = Object.keys(_.groupBy(safeData, "partner"))
    const deviceNames = Object.keys(_.groupBy(safeData, "asset_name"))
    const sampleTypes = Object.keys(_.groupBy(safeData, "sample_type"))

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
        // timeout: 1000,
    });
    console.log(sessionStorage.getItem("token"))
    const header = {
        headers: {
            'authorization': `Bearer ${sessionStorage.getItem("token")}`

        }
    }


    const [userDistributionData, setUserDistributionData] = useState([])

    useEffect(() => {
        const employeeId = localStorage.getItem("employee_id");


        axiosInstance.get(`distribution/getDistributionByEmployeeId/${employeeId}`, header).then(resp => {
            console.log({ resp })
            setUserDistributionData(resp.data);
            setSafeData(resp.data);

        }).catch(e => {
            console.log({ e })
            if (e.response.status !== 200) {
                setIsLoggedIn(false)
                sessionStorage.removeItem("token")
            }
        })
        // (async () => {
        //     const resp = await axiosInstance.get(`distribution/getDistributionByEmployeeId/${employeeId}`, header)
        //     console.log({ resp })
        // })()
    }, [showDistributionPopup, showReturnPopup, showTransferPopup, showDetailsForm])

    useEffect(() => {
        setUserDistributionData(prevData => {
            const partnerFilteredData = safeData.filter(obj => filters.partner === "" ? obj : obj.partner === filters.partner)
            const deviceFilteredData = partnerFilteredData.filter(obj => filters.deviceName === "" ? obj : obj.asset_name === filters.deviceName)
            const sampleTypeFilteredData = deviceFilteredData.filter(obj => filters.sampleType === "" ? obj : obj.sample_type === filters.sampleType)
            return sampleTypeFilteredData
        })
    }, [filters])

    const handleAddMacOnClick = (e, row) => {
        console.log(row);
        setSelectedRow(row)


        if (row.asset_device_id === 0) {
            console.log(row.distribution_quantity)
            setShowDetailsForm(true)

        }
        else {
            setShowDetailsForm(false)
            setShowAddMacPopup(true);

        }
    };

    const handleOnDistributionCLick = (e, row) => {

        if (row.asset_device_id === 0) {
            setSelectedRow(row);
            setShowDistributionPopup(true);
        }
        else {
            setSelectedRowValue(row);
            setErrDistributionPopup(true);
        }
    }

    const handleReturnOnClick = (e, row) => {
        setSelectedRow(row);
        if (row.asset_device_id == 0) {
            setShowErrAddMacPopup(true);
        }
        else {

            setShowReturnPopup(true);
            setShowErrAddMacPopup(false);
        }
    }

    const handleTransferOnClick = (e, row) => {
        setErrDistributionPopup(false);
        setSelectedRow(row)
        if (row.asset_device_id == 0) {
            setShowErrAddMacPopup(true);
        }
        else {
            setShowTransferPopup(true)
            setShowErrAddMacPopup(false);
        }


    }
    const handleHistoryOnClick = (e, row) => {
        setSelectedRow(row)
        setShowHistoryPopup(true)
    }

    const handleSubmit = (e) => {

    }

    const handleOnlick = (e) => {
        const clickedButton = e.target.innerText;

        navigate("/userView")
        setErrDistributionPopup(false)
    }

    const handleAddMacYesNoOnClick = (e) => {
        const clickedButton = e.target.innerText;
        console.log(clickedButton);
        if (clickedButton === "Yes") {
            navigate("/home");
        }
        else {
            setShowAddMacPopup(false);

        }
        //  navigate("/home");




    }

    const handleErrAddMacYesNoOnClick = (e, row) => {
        const clickedButton = e.target.innerText;

        if (clickedButton === "Yes") {
            setShowDetailsForm(true);
            setShowErrAddMacPopup(false);
        }
        else {
            setShowErrAddMacPopup(false);
        }


    }




    return (
        <div>

            <div className='table-data'>


                <div className='user-record-scroll'>
                    {/* <div className="filtersContainer">

                        <select onChange={(e) => handleChange(e, "partner")}>
                            <option key="Default" value="">Partner</option>
                            {(partners || []).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <select onChange={(e) => handleChange(e, "deviceName")}>
                            <option key="Default" value="">Device Name</option>
                            {(deviceNames || []).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <select onChange={(e) => handleChange(e, "sampleType")}>
                            <option key="Default" value="">sample type</option>
                            {(sampleTypes || []).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                    </div> */}
                    <HomeButton />
                    <div className='top-bar'>
                        {role === "ADMIN" && (<button onClick={() => { navigate("/assetInventory") }} className="my-button" >Add Inventory</button>)}
                        {/* <button onClick={() => { navigate("/userView") }} className="button">User View</button> */}
                        <button onClick={() => { navigate("/acceptance") }} className="my-button">Pending Approval</button>
                        <button onClick={() => { navigate("/showInventory") }} className="my-button">Show Inventories </button>
                        <button onClick={() => { navigate("/receiverAcceptance") }} className="my-button">Pending Acceptance </button>
                    </div>

                    <table >

                        <thead>
                            <tr >
                                <th className="table-row-data">
                                    <select className="select-width" onChange={(e) => handleChange(e, "deviceName")}>
                                        <option key="Default" value="">Device Name</option>
                                        {(deviceNames || []).map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th className="table-row-data">
                                    <select className='select-width' onChange={(e) => handleChange(e, "partner")}>
                                        <option key="Default" value="">Partner</option>
                                        {(partners || []).map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>

                                <th className="table-row-data">
                                    <select className="select-width" onChange={(e) => handleChange(e, "sampleType")}>
                                        <option key="Default" value="">Sample Type</option>
                                        {(sampleTypes || []).map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                {/* <th className="table-row-data">Product</th>
                                <th className="table-row-data">Vendor</th>
                                <th className="table-row-data">Sample</th> */}
                                <th className="table-row-data">Available Quantity </th>
                                <th className='actionButtons'>Action</th>

                            </tr>
                        </thead>

                        <div className='table-tbody'>
                            <tbody >
                                {userDistributionData.map((row, i) => (
                                    <tr key={i}>
                                        <td className="table-row-data">{row.asset_name}</td>
                                        <td className="table-row-data">{row.partner}</td>
                                        <td className="table-row-data">{row.sample_type}</td>
                                        <td className="table-row-data">{row.asset_device_id === 0 ? row.distribution_quantity : 1}</td>
                                        <td className='buttons'>
                                            <button className='my-button' onClick={(e) => handleAddMacOnClick(e, row)} disabled={showAddMacPopup || showDetailsForm}>Add Mac</button>{"  /  "}
                                            {role === "ADMIN" && <button className='my-button' onClick={(e) => handleOnDistributionCLick(e, row)}>Distribute</button>}{"  /  "}
                                            <button className='my-button' onClick={(e) => handleReturnOnClick(e, row)}>Return</button>{"  /  "}
                                            <button className='my-button' onClick={(e) => handleTransferOnClick(e, row)}>Transfer</button>{"  /  "}
                                            <button className='my-button' onClick={(e) => handleHistoryOnClick(e, row)}>show History</button>
                                            {/* <button className='my-button'>Accept</button> */}
                                        </td>


                                    </tr>
                                ))}

                            </tbody>
                        </div>

                    </table>
                </div>
            </div>
            <div >
                {showDetailsForm && <DeviceDetails setDeviceDetails={setDeviceDetails} setShowDetailsForm={setShowDetailsForm} selectedRow={selectedRow} onSubmit={handleSubmit} />}

            </div>
            <div >
                {showDistributionPopup && <DistributePopup setShowDistributionPopup={setShowDistributionPopup} selectedRow={selectedRow} setSelectedRow={setSelectedRow} onSubmit={handleSubmit} />}

            </div>
            <div >
                {showReturnPopup && <ReturnPopUp setShowReturnPopup={setShowReturnPopup} selectedRow={selectedRow} onSubmit={handleSubmit} />}

            </div>
            <div >
                {showTransferPopup && <TransferPopup setShowTransferPopup={setShowTransferPopup} selectedRow={selectedRow} onSubmit={handleSubmit} />}

            </div>
            <div >
                {showHistoryPoup && <HistoryPopup setShowHistoryPopup={setShowHistoryPopup} selectedRow={selectedRow} onSubmit={handleSubmit} />}

            </div>
            <PopUp visible={showAddMacPopup} setVisible={setShowAddMacPopup}>
                <div>
                    <div className='already-mac-added-popup'>Already Mapped</div>
                    <br />
                    <br />
                    <div className='add-mac-go-back'>Do you want to go home?
                        <br />

                    </div>
                    <br />
                    <br />
                    <div className='mac-pop-yes-no'>
                        <button className='yes' onClick={handleAddMacYesNoOnClick}>Yes</button>
                        <button className='no' onClick={handleAddMacYesNoOnClick}>No</button>
                    </div>
                    <br />
                    <br />
                </div>
            </PopUp>
            <PopUp visible={errDistributionPopup} setVisible={setErrDistributionPopup}>
                <div>
                    <div className="page-success-message"> Device is assigned to you</div>
                    <br />
                    <br />
                    <h1 className='add-more'>Do you want Transfer?</h1>
                    <br />
                    <div className='popup-button'>
                        <button className='yes' onClick={(e) => handleTransferOnClick(e, selectedRowValue)}>Yes</button>
                        <button className='no' onClick={handleOnlick}>No</button>
                    </div>
                </div>
            </PopUp>
            <PopUp visible={showErrAddMacPopup} setVisible={setShowErrAddMacPopup}>
                <div>
                    <div className='already-mac-added-popup'>Add Mac Id First</div>
                    <br />
                    <br />
                    <div className='add-mac-go-back'>Do you want to add your Mac Id
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

            <PopUp visible={showErrAddMacPopup} setVisible={setShowErrAddMacPopup}>
                <div>
                    <div className='already-mac-added-popup'>Add Mac Id First</div>
                    <br />
                    <br />
                    <div className='add-mac-go-back'>Do you want to add your Mac Id
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
export default UserView;