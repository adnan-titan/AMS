import './index.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';




const Transfer = () => {
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [transferEmployeeId, setTransferRmployeeId] = useState('');
  const [deviceUniqueId, setDeviceUniqueId] = useState('');

  const handleCurrentEmployeeIdChange = (e) => {
    setCurrentEmployeeId(e.target.value);
  };

  const handleTranferEmployeeIdChange = (e) => {
    setTransferRmployeeId(e.target.value);
  };
  const handleDeviceUniqueIdChange = (e) => {
    setDeviceUniqueId(e.target.value);
  };
  const header = {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    }
  }


  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    console.log("handlesubmit called")
    e.preventDefault()
    const body = {
      current_user_employee_id: currentEmployeeId,
      transfer_user_employee_id: transferEmployeeId,
      device_unique_id: deviceUniqueId
    }

    axiosInstance.post("distribution/reAssignAsset", body, header).then(resp => {
      console.log({ resp })
      //localStorage.setItem("distribution_id", resp.data)

      navigate('/userView')
      // 

    }).catch(e => navigate('/'))
  }













  return (
    <div className="login-container">
      <h2>Transfer Device</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From:</label>
          <input
            type="text"
            value={currentEmployeeId}
            onChange={handleCurrentEmployeeIdChange}
            required
          />
        </div>
        <div className="form-group">
          <label>To:</label>
          <input
            type="text"
            value={transferEmployeeId}
            onChange={handleTranferEmployeeIdChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Device Unique Number:</label>
          <input
            type="text"
            value={deviceUniqueId}
            onChange={handleDeviceUniqueIdChange}
            required
          />
        </div>
        <button type="submit" className="btn-login">Submit</button>
      </form>
    </div>
  );
};

export default Transfer;