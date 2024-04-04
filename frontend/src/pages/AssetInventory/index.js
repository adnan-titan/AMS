import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import styles from './index.module.css'
import TextField from '../../components/TextField';
import TextFieldOrSelect from '../../components/TextFieldOrSelect';
import add from './add.png'
// import home from './home.png'
import { useEffect } from 'react';
import _ from 'lodash'
import HomeButton from '../../components/HomeButton';

import PopUp from '../Popup';
import LoginContext from '../../utils/LoginContext';
import { useContext } from 'react'



const AssetInventory = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [inventoryDetails, setInventoryDetails] = useState([])
  const { role, setIsLoggedIn } = useContext(LoginContext)


  console.log('Asset Inventory rRendered')
  const [formData, setFormData] = useState({
    assetName: '',
    quantityReceived: '',
    receivedDate: '',
    partner: '',
    courierService: '',
    sampleType: '',
    details: ''
  });

  const [showTextField, setShowTextField] = useState(false)

  const handleChange = (e, fieldValue) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldValue]: e.target.value
    }))
  }



  const sample = [
    {
      label: "select sample",
      value: ""
    },
    {
      label: "EV1",
      value: "EV1"
    },
    {
      label: "EV2",
      value: "EV2"
    },
    {
      label: "DVT1",
      value: "dvt1"
    },
    {
      label: "DVT2",
      value: "DVT2"
    },


    {
      label: "MP",
      value: "MP"
    },
    {
      label: "OTHER",
      value: "OTHER"
    }
  ]

  // const [selectedOption, setSelectedOption] = useState(); // Default value, change it to the desired default option






  const navigate = useNavigate();

  const header = {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    }
  }

  const handleSubmit = (e) => {

    e.preventDefault();
    const {
      assetName,
      quantityReceived,
      receivedDate,
      partner,
      courierService,
      sampleType,
      details
    } = formData
    const dataToSend = {
      asset_name: assetName,
      quantity_received: quantityReceived,
      received_date: receivedDate,
      updated_date: "",
      partner,
      courier_service: courierService,
      sample_type: sampleType,
      details: details,
      user: {
        employee_id: localStorage.getItem("employee_id")
      }

    }
    console.log(header);
    console.log(dataToSend);

    axiosInstance.post("asset/addAsset", dataToSend, header).then(resp => {
      console.log(dataToSend);
      setShowPopup(true);

      //navigate('/home')
      // 

    }).catch(e =>

      navigate('/'));

  }

  const [tableData, setTableData] = useState([]);
  // const axiosInstance = axios.create({
  //   baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/',
  //   // timeout: 1000,
  //   // headers: {'X-Custom-Header': 'foobar'}
  // });

  const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8080/',
    //  baseURL: 'http://assetmanagement-backend-env.eba-js2mgz8w.ap-south-1.elasticbeanstalk.com/'
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
    baseURL: 'http://10.0.46.75:8080/',
  });

  useEffect(() => {

    const employee_id = localStorage.getItem("employee_id");

    console.log(header)
    console.log({ header })


    axiosInstance.get("asset/getAllInventory", header).then(data => {
      console.log({ data })

      setTableData(data.data)
      setFormData(prev => ({
        ...prev,
        assetName: data.data.length > 0 ? data.data[0].asset_name : prev.assetName,
        partner: data.data.length > 0 ? data.data[0].partner : prev.partner
      }))
    }).catch(e => {
      console.log({ e })
      if (e.response.status !== 200) {
        setIsLoggedIn(false)
        sessionStorage.removeItem("token")
      }
    })

  }, [showPopup])
  useEffect(() => {
    console.log({ formData })
    setFormData(prev => ({
      ...prev,
      quantityReceived: '',
      receivedDate: '',
      courierService: '',
      sampleType: '',
      details: ''
    }))
  }, [showPopup])

  const getOptions = (name) => {
    const optionsArray = Object.keys(_.groupBy(tableData, name))
    console.log({ optionsArray })

    optionsArray.push("Add new")

    return optionsArray
  }

  const handleOnImageClick = (e) => {

    navigate("/home");

  }

  // useEffect(() => {
  //   console.log({ formData })
  //   if (formData.assetName === "Add new") {
  //     setShowTextField(true)
  //   }
  // }, [formData])

  const handleOnlick = (e) => {
    console.log(e.target.innerText)
    const clickedButton = e.target.innerText
    if (clickedButton === "Yes") {
      setShowPopup(false)
    }
    else {
      navigate("/userView")
    }


  }

  const assetOptions = getOptions("asset_name")
  const partnerOptions = getOptions("partner")
  return (

    <div className={styles['whole-inventory']}>

      {/* <div className={styles['inventory-logo ']} >Add to Inventory
        <img onClick={(e) => handleOnImageClick(e)} src={home} width="50" height="60" padding="30px" alt="Add to Inventory" />
      </div> */}
      <HomeButton />

      <div className={styles['forum-inventory']} >
        <div className={styles['add-inventory']}>Add Inventory</div>

        {/* <h2>Asset Inventory</h2> */}
        <form onSubmit={handleSubmit}>
          <div className={styles['text-field']}>
            <TextFieldOrSelect options={assetOptions || []} label="Asset Name" showTextField={!assetOptions.includes(formData.assetName) || formData.assetName === "Add new"} value={formData.assetName} onChange={(e) => handleChange(e, "assetName")} setShowTextField={setShowTextField} setFormData={setFormData} keyName="assetName" required />

            <TextField className={styles.textFieldWithMinWidth} label="Quantity" type="text" value={formData.quantityReceived} onChange={(e) => handleChange(e, "quantityReceived")} required />

            <TextFieldOrSelect options={partnerOptions || []} label="Partner" showTextField={!partnerOptions.includes(formData.partner) || formData.partner === "Add new"} value={formData.partner} onChange={(e) => handleChange(e, "partner")} setFormData={setFormData} keyName="partner" required />
            <TextField className={styles.textFieldWithMinWidth} label="Received Date" type="date" value={formData.receivedDate} onChange={(e) => handleChange(e, "receivedDate")} required />
            <TextField className={styles.textFieldWithMinWidth} label="Courier Service" type="text" value={formData.courierService} onChange={(e) => handleChange(e, "courierService")} required />
            {/* //<TextField className={styles.textFieldWithMinWidth} label="Sample Type" type="text" value={formData.sampleType} onChange={(e) => handleChange(e, "sampleType")} required /> */}
            <TextField className={styles.textFieldWithMinWidth} label="Additional Details" type="text" value={formData.details} onChange={(e) => handleChange(e, "details")} required />
            <div className={styles['select-sample']}>
              <select
                value={formData.sampleType}
                onChange={(e) => handleChange(e, "sampleType")}
              >
                {sample.map((c, i) => <option key={i} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className={styles["btn-add"]} disabled={showPopup}>Add</button>


        </form>
      </div>
      {/* <div >
        {showPopUP && <PopUp setInventoryDetails={setInventoryDetails} setShowPopUp={setShowPopUp} />}

      </div> */}

      <PopUp visible={showPopup} setVisible={setShowPopup}>
        <div>
          <div className={styles['success-message']}>Inventory added Successfully</div>
          <br />
          <br />
          <h1 className={styles['add-more']}>Do you want to add more ?</h1>
          <br />
          <div className={styles['popup-button']}>
            <button className='yes' onClick={handleOnlick}>Yes</button>
            <button className='no' onClick={handleOnlick}>No</button>
          </div>
        </div>
      </PopUp>

    </div>
  );
};


export default AssetInventory;
