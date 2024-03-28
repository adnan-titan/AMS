import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CenterContainer from '../../components/CenterContainer'
import "./index.css"
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'

function Distribution() {
  const [distributionData, setDistributionData] = useState({
    employeId: "",
    partner: [],
    inventoryId: [],
    availableQuantity: "",
    requiredQuantity: "",
    manager: ""
  })
  const [selectedPartner, setSelectedPartner] = useState("")
  const [selectedInventoryId, setSelectedInventoryId] = useState(null)
  const { role, setIsLoggedIn } = useContext(LoginContext)


  const handlePartnerChange = (e) => {
    setSelectedPartner(e.target.value)
  };

  const handleInventoryChange = (e) => {
    setSelectedInventoryId(e.target.value)
  }



  // const axiosInstance = axios.create({
  //   baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
  //   // timeout: 1000,
  //   // headers: {'X-Custom-Header': 'foobar'}
  // });
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
  });

  useEffect(() => {
    axiosInstance.get("asset/getPartner").then(data => {
      console.log({ data })
      setDistributionData(prevData => ({
        ...prevData,
        partner: data.data
      }))
    }).catch(e => {
      console.log({ e })
      if (e.response.status !== 200) {
        setIsLoggedIn(false)
        sessionStorage.removeItem("token")
      }
    })
  }, [])

  const handleBlur = () => {
    console.log({ empId: distributionData.employeId })
    axiosInstance.get(`user/getManager?employee_id=${distributionData.employeId}`).then(data => {
      console.log("inside then of axios")
      console.log({ data })
      setDistributionData(prevData => ({
        ...prevData,
        manager: data.data
      }))
      console.log("after changing", distributionData)
    }).catch(e => {
      console.log("some error")
    })

  };

  const handleChange = (e) => {
    console.log("called handlecHnage")
    setDistributionData(prev => ({
      ...prev,
      employeId: e.target.value
    }))
  }
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    console.log("handlesubmit called")
    e.preventDefault()
    const body = {
      employee: {
        employee_id: distributionData.employeId
      },
      asset_inventory: {
        inventory_id: selectedInventoryId
      },
      quantity: distributionData.requiredQuantity

    }
    axiosInstance.post("distribution/assignAsset", body).then(resp => {
      console.log({ resp })
      localStorage.setItem("distribution_id", resp.data)

      navigate('/home')
      // 

    }).catch(e => navigate('/'))
  }
  const handleOnRequiredQuantityChange = (e) => {
    if (e.target.value > distributionData.availableQuantity) {
      e.target.value = 0
      alert("Required quantity should be less than Available qantity")
      setDistributionData(prev => ({
        ...prev,
        requiredQuantity: 0
      }))
      return;

    }
    setDistributionData(prev => ({
      ...prev,
      requiredQuantity: e.target.value
    }))
  }


  useEffect(() => {
    console.log(selectedPartner)
    if (!!selectedPartner && selectedPartner !== 'Please select')
      axiosInstance.get(`asset/getInventory?partner=${selectedPartner}`).then(data => {
        console.log("getData", data.data)
        setDistributionData(prevData => ({
          ...prevData,
          inventoryId: data.data

        }))
        setSelectedInventoryId(null)
        setDistributionData(prev => ({
          ...prev,
          availableQuantity: ""
        }))

      }
      ).catch(e => {
        console.log(e)
      })
  }, [selectedPartner])

  useEffect(() => {
    console.log(selectedInventoryId)

    if (!!selectedInventoryId && selectedInventoryId !== 'Please select')
      axiosInstance.get(`asset/getAvailableQuantity?inventory_id=${selectedInventoryId}`).then(data => {
        setDistributionData(prevData => ({
          ...prevData,
          availableQuantity: data.data

        }))
      })


  }, [selectedInventoryId])

  return (
    <div>
      <h1>Distribution</h1>
      <CenterContainer className={"centerWrapper"}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>employeeId:</label>
            <input type="text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label>partner:</label>
            <select onChange={handlePartnerChange}>
              <option key="Default" value="Please select">Please select</option>
              {distributionData.partner.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Inventory Id:</label>
            <select onChange={handleInventoryChange}>
              <option key="Default" value="Please select">Please select</option>
              {distributionData.inventoryId.map((option) => (
                <option key={option.id} value={option.id}>
                  {option}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label>available Quantity:</label>
            <input type="text"
              value={distributionData.availableQuantity}
            />
          </div>


          <div>
            <label>Required Quantity:</label>
            <input type="number" onChange={handleOnRequiredQuantityChange}
              max={distributionData.availableQuantity} />
          </div>


          <div>
            <label>Reporting Manager:</label>
            <input
              type="text"
              value={distributionData.manager}
            />

          </div>
          <button type="submit" className="btn-login">Submit</button>
        </form>
      </CenterContainer>


    </div>
  );
}

export default Distribution;

// const Distribution = () => {
//     const [distributionData, setDistributionData] = useState({
//         employeeId: "",
//         partner: [],
//         deviceName: [],
//         inventoryId: "",
//         qntt: 0,
//         approveBy: ""
//     })


