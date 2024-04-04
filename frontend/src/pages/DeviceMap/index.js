import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import DeviceDetails from "../../components/DeviceDetails";
import { useNavigate } from "react-router-dom";
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'

const DeviceMap = () => {
    const [mapData, setMapData] = useState([]);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(0)
    const [deviceDetails, setDeviceDetails] = useState([])
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
        // baseURL: 'http://localhost:8080/',
        //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
        // timeout: 1000,
        // headers: {'X-Custom-Header': 'foobar'}

        baseURL: 'http://10.0.46.75:8080/',
    });
    const employee_id = localStorage.getItem("employee_id")
    const navigate = useNavigate();




    useEffect(() => {
        if (employee_id !== null) {
            axiosInstance.get(`distribution/getDistributionByEmployeeId/${employee_id}`, header).then(data => {
                console.log({ data })
                setMapData(data.data)

            }).catch(e => {
                console.log({ e })
                if (e.response.status !== 200) {
                    setIsLoggedIn(false)
                    sessionStorage.removeItem("token")
                }
            })
        }
        else {
            navigate("/");
        }
    }, [])




    const handleOnClick = (e, row) => {
        setSelectedRow(row)
        setShowDetailsForm(true)
    };
    const handleSubmit = () => {
        const body = {
            assetDistribution: {
                distribution_id: selectedRow.distribution_id
            },

            device_unique_id: Object.keys(deviceDetails).map(key => deviceDetails[key])
        }
        console.log({ body })
        axiosInstance.post(`asset/assetDeviceMapping`, body, header).then(d => {

            navigate("/deviceMap")
        }
        )

    }



    return (

        <div>

            <div className=" return-container" >

                <h1 className='record'> Records</h1>

                <div className='inner-container'>

                    <table>
                        <thead>
                            <tr>
                                <th>Device Name</th>
                                <th>Quantity</th>
                                <th>Add Device Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mapData.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.deviceName}</td>
                                    <td>{row.quantity}</td>
                                    <td><button onClick={(e) => handleOnClick(e, row)} className="btn-login">Map</button></td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div >
                {showDetailsForm && <DeviceDetails setDeviceDetails={setDeviceDetails} setShowDetailsForm={setShowDetailsForm} numberOfRows={selectedRow.quantity} onSubmit={handleSubmit} />}

            </div>
            {/* {recordUpdateType !== "" && (<ReturnPopUp setReturnData={setReturnData} returnData={returnData} setRecordUpdateType={setRecordUpdateType} recordUpdateType={recordUpdateType} adnan={handleFormSubmit} />)} */}
        </div>
    );


};
export default DeviceMap;


