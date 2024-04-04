import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./index.css"
import _ from 'lodash'
import { useNavigate } from "react-router-dom";
import HomeButton from "../../components/HomeButton";
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'

function ShowInventory() {

    const [tableData, setTableData] = useState([])
    const [safeData, setSafeData] = useState([])
    const { role, setIsLoggedIn } = useContext(LoginContext)
    const [filters, setFilters] = useState({
        partner: "",
        deviceName: "",
        receivedDate: "",

    })


    const partners = Object.keys(_.groupBy(safeData, "partner"))
    const deviceNames = Object.keys(_.groupBy(safeData, "asset_name"))

    console.log({ partners, deviceNames })
    const handleChange = (e, fieldValue) => {
        setFilters(prevData => ({ ...prevData, [fieldValue]: e.target.value }))
    }

    const navigate = useNavigate();
    // const axiosInstance = axios.create({
    //     baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',

    // });
    const axiosInstance = axios.create({
        //baseURL: 'http://localhost:8080/',
        //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
        // timeout: 1000,
        // headers: {'X-Custom-Header': 'foobar'}
        baseURL: 'http://10.0.46.75:8080/',
    });

    const header = {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    }

    useEffect(() => {
        const employeeId = localStorage.getItem("employee_id");

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
            const receivedDateFilteredData = deviceFilteredData.filter(obj => filters.receivedDate === "" ? obj : obj.received_date === filters.receivedDate)
            return receivedDateFilteredData
        })
    }, [filters])

    return (

        <div>
            <div className="ShowInventory show-container" >



                <div>

                    <div className="inventory-record">Inventory Records</div>


                    <div className="filtersContainer">
                        <HomeButton />


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
                        <input className="input" type="date" onChange={(e) => handleChange(e, "sampleType")} />
                        {/* <select onChange={(e) => handleChange(e, "receivedDate")}>
                        <option key="Default" value="">Received Date</option>
                        {(partners || []).map((option) => (
                            <option key={option} value={option}>
                                {option}

                            </option>
                        ))}

                    </select> */}
                    </div>

                    <div >
                        <table>
                            <thead>
                                <tr>
                                    <th>Device Name</th>
                                    <th>Partner</th>
                                    <th>Quantity Available</th>
                                    <th>Quantity Received</th>
                                    <th>Received Date</th>
                                    <th>Updated Date</th>

                                    <th>Sample Type</th>
                                    <th>Courier Service</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <div className='showInventory-table-body'>
                                <tbody>
                                    {tableData.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.asset_name}</td>
                                            <td>{row.partner}</td>
                                            <td>{row.quantity_available}</td>
                                            <td>{row.quantity_received}</td>
                                            <td>{row.received_date}</td>
                                            <td>{row.updated_date}</td>
                                            <td>{row.sample_type}</td>
                                            <td>{row.courier_service}</td>
                                            <td>{row.details}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </div>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ShowInventory