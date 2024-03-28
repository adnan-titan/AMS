
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import ShowInventory from '../ShowInventory';
import Header from '../Header';
import LoginContext from '../../utils/LoginContext';
import home from './home.png'


const HomePage = () => {
  const navigate = useNavigate();
  const employee_id = localStorage.getItem("employee_id");
  const { role } = useContext(LoginContext)

  return (

    <div className='whole-page'>
      {/* <div className='home'> Home
        <img src={home} width="50" height="60" padding="30px" alt="Home" />
      </div> */}

      <div className='buttonsContainer'>
        {role === "ADMIN" && (<button onClick={() => { navigate("/assetInventory") }} className="button" >Add Inventory</button>)}
        <button onClick={() => { navigate("/userView") }} className="button">User View</button>
        <button onClick={() => { navigate("/acceptance") }} className="button">Pending Approval</button>
        <button onClick={() => { navigate("/showInventory") }} className="button">Show Inventories </button>
        <button onClick={() => { navigate("/receiverAcceptance") }} className="button">Pending Acceptance </button>



      </div>

    </div>

  );
};




// import React from 'react';
// import './index.css'
// const HomePage = () => {
//   return (
//     <div className="button-page">
//       <button className="button">Button 1</button>
//       <button className="button">Button 2</button>
//       <button className="button">Button 3</button>
//       <button className="button">Button 4</button>
//       <button className="button">Button 5</button>
//     </div>
//   );
// };




export default HomePage;
