
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PopUp from "../Popup";
import './index.css'
import HomeButton from '../../components/HomeButton';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'


const ReceiverAcceptance = () => {


    const [selectedRow, setSelectedRow] = useState([]);
    const navigate = useNavigate();
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);
    const token = sessionStorage.getItem("token")
    const { role, setIsLoggedIn } = useContext(LoginContext)


    // const axiosInstance = axios.create({
    //     baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
    //     // timeout: 1000,
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
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

    const [acceptData, setAcceptData] = useState([])

    useEffect(() => {
        const employeeId = localStorage.getItem("employee_id");

        axiosInstance.get(`distribution/getWaitingForApproval/${employeeId}`, header).then(data => {
            console.log({ data })
            setAcceptData(data.data);


        }).catch(e => {
            console.log({ e })
            if (e.response.status !== 200) {
                setIsLoggedIn(false)
                sessionStorage.removeItem("token")
            }
        })

    }, [showAcceptPopup])
    const handleOnlick = (e) => {
        console.log(e.target.innerText)
        const clickedButton = e.target.innerText
        if (clickedButton === "Yes") {
            setShowAcceptPopup(false)
        }
        else {
            navigate("/home")
        }


    }

    // const handleAccept = (e, row) => {
    //     setSelectedRow(row);
    //     const body = {
    //         distributionId: row.assetDistribution.distribution_id,
    //         acceptanceId: row.acceptanceId

    //     }
    //     console.log(body)
    //     axiosInstance.post("distribution/approvedAcceptance", body, header).then(resp => {
    //         console.log(body);
    //         setShowAcceptPopup(true);
    //     }).catch(e =>

    //         navigate('/'));

    // }


    return (
        <div>

            <div className='table-data'>
                <HomeButton />
                <div className='accept-table-data'>
                    <table >
                        <thead>
                            <tr >
                                <th className="table-row-data">Product</th>
                                <th className="table-row-data">Vendor</th>
                                <th className="table-row-data">Sample</th>
                                <th className="table-row-data">Quantity </th>
                                <th className="table-row-data">Distributed To </th>
                                <th className="table-row-data">Name</th>
                                <th className="table-row-data extra-width">Email</th>
                                <th className="table-row-data">Pending</th>


                            </tr>
                        </thead>
                        <div className='table-tbody'>
                            <tbody >
                                {acceptData.map((row, i) => (
                                    <tr key={i}>
                                        <td className="table-row-data">{row.assetDistribution.asset_name}</td>
                                        <td className="table-row-data">{row.assetDistribution.partner}</td>
                                        <td className="table-row-data">{row.assetDistribution.sample_type}</td>
                                        <td className="table-row-data">{row.assetDistribution.quantity}</td>
                                        <td className="table-row-data">{row.receiverEmployeeId.employee_id}</td>
                                        <td className="table-row-data">{row.receiverEmployeeId.employee_name}</td>
                                        <td className="table-row-data extra-width">{row.receiverEmployeeId.email}</td>
                                        <td className='buttons table-row-data'> waiting for acceptance
                                            {/* <button className='my-button' onClick={(e) => handleAccept(e, row)}>Accept</button> */}
                                        </td>


                                    </tr>
                                ))}

                            </tbody>
                        </div>
                    </table>
                </div>
            </div>
            <PopUp visible={showAcceptPopup} setVisible={setShowAcceptPopup}>
                <div>
                    <div className='accept-success-message'>You have accepted the Asset</div>
                    <br />
                    <br />
                    <h1 className='add-more'>Do you want to go Pending for acceptance?</h1>
                    <br />
                    <div className='popup-button'>
                        <button onClick={handleOnlick}>Yes</button>
                        <button onClick={handleOnlick}>No</button>
                    </div>
                </div>
            </PopUp>
        </div>
    )
}
export default ReceiverAcceptance;