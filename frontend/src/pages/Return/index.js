import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import custom CSS file for styling
import axios from 'axios';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'

import ReturnAssetPopUp from '../AssetReturnPopUp';


const Return = () => {
  const [tableData, setTableData] = useState([]);
  const [recordUpdateType, setRecordUpdateType] = useState("");
  const { role, setIsLoggedIn } = useContext(LoginContext)
  const [returnData, setReturnData] = useState({
    transferEmployeeId: "",
    condition: "Good",
    comments: ""

  })
  const [deviceUniqueId, setDeviceUniqueId] = useState();
  const handleOnClick = (e, row) => {
    setDeviceUniqueId(row)
    setRecordUpdateType(e.target.innerText)
  };
  const header = {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    }
  }

  // const axiosInstance = axios.create({
  //   baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
  //   // timeout: 1000,
  //   // headers: {'X-Custom-Header': 'foobar'}
  // });
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
    //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  });

  const navigate = useNavigate();
  const handleFormSubmit = (e) => {
    console.log("handlesubmit called")
    e.preventDefault()
    const returnBody = {
      user: {
        employee_id: localStorage.getItem("employee_id")
      },

      device_unique_id: deviceUniqueId,
      status: returnData.condition,
      comment: returnData.comments

    }
    const transferBody = {

      current_user_employee_id: localStorage.getItem("employee_id"),
      transfer_user_employee_id: returnData.transferEmployeeId,
      device_unique_id: deviceUniqueId

    }

    const body = recordUpdateType === "Transfer" ? transferBody : returnBody
    const endpoint = recordUpdateType === "Transfer" ? "reAssignAsset" : "returnAsset"

    console.log(body);
    axiosInstance.post(`asset/${endpoint}`, body, header).then(resp => {

      console.log({ resp })

      navigate('/home')
      // 

    }).catch(e => navigate('/'))
  }


  // localStorage.setItem("employee_id", 1774990);
  useEffect(() => {
    const employee_id = localStorage.getItem("employee_id");
    console.log(employee_id);

    axiosInstance.get('user/getDevices/' + localStorage.getItem("employee_id"), header).then(data => {
      console.log({ data })
      setTableData(data.data)

    }).catch(e => {
      console.log({ e })
      if (e.response.status !== 200) {
        setIsLoggedIn(false)
        sessionStorage.removeItem("token")
      }
    })



  }, [])






  return (

    <div>

      <div className=" return-container" >

        <h1 className='record'> Records</h1>

        <div className='inner-container'>

          <table>
            <thead>
              <tr>
                <th>device unique id</th>
                <th>Transfer</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <td>{row}</td>
                  <td><button onClick={(e) => handleOnClick(e, row)} className="btn-login">Transfer</button></td>
                  <td><button onClick={(e) => handleOnClick(e, row)} className="btn-login">Return</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {recordUpdateType !== "" && (<ReturnAssetPopUp setReturnData={setReturnData} returnData={returnData} setRecordUpdateType={setRecordUpdateType} recordUpdateType={recordUpdateType} adnan={handleFormSubmit} />)}
    </div>
  );
};

export default Return;
