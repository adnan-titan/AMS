import React, { useContext, useEffect, useState } from 'react'
import AssetInventory from "./pages/AssetInventory";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Distribution from "./pages/Distribution";
import Transfer from "./pages/Transfer";
import Return from "./pages/Return";
import ShowInventory from "./pages/ShowInventory";
import DistributeDevices from "./pages/DIstributeDevices";
import Header from "./pages/Header";
import Background from "./pages/Background";
import SignUp from "./pages/SignUp";
import UserDetail from "./pages/UserDetail";
import DeviceMap from "./pages/DeviceMap";
import useAuth from "./useAuth";
import LoginContext from './utils/LoginContext';
import userView from './pages/UserView';
import UserView from './pages/UserView';
import Acceptance from './pages/Acceptance';
import ReceiverAcceptance from './pages/ReceiverAcceptance';

import Login from './components/Login';











function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("")
  return (
    <>
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
        <Router>
          {/* <Background /> */}
          <Header />

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute component={HomePage} />} />
            <Route path="/assetInventory" element={<ProtectedRoute requireAdminAccess component={AssetInventory} />} />
            <Route path="/distribution" element={<ProtectedRoute component={Distribution} />} />
            <Route path="/transfer" element={<ProtectedRoute component={Transfer} />} />
            <Route path="/return" element={<ProtectedRoute component={Return} />} />
            <Route path="/showInventory" element={<ProtectedRoute component={ShowInventory} />} />
            <Route path="/distributedDevices" element={<ProtectedRoute component={DistributeDevices} />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/userDetail" element={<UserDetail />} />
            <Route path="/deviceMap" element={<ProtectedRoute component={DeviceMap} />} />
            <Route path="/userView" element={<ProtectedRoute component={UserView} />} />
            <Route path="/acceptance" element={<ProtectedRoute component={Acceptance} />} />
            <Route path="/receiverAcceptance" element={<ProtectedRoute component={ReceiverAcceptance} />} />
            <Route path="*" element={<Navigate to='/' replace />} />
          </Routes>
        </Router>

      </LoginContext.Provider>
    </>
  );
}

export default App;

const ProtectedRoute = ({ component: Component, requireAdminAccess, ...rest }) => {
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, role, setRole } = useContext(LoginContext);

  console.log("Protected route", isLoggedIn)
  useAuth();
  const token = sessionStorage.getItem("token");
  const roleFromSessionStorage = sessionStorage.getItem("role")
  useEffect(() => {
    console.log("asif habib", isLoggedIn, token)
    if (!isLoggedIn && !token) {
      console.log(isLoggedIn)
      navigate("/")
      // return

    }


    setRole(prev => roleFromSessionStorage)
    setIsLoggedIn(prevValue => !token ? false : true)
    console.log("pretected route", role);

  }, [isLoggedIn, token, roleFromSessionStorage])

  if (requireAdminAccess && role !== "ADMIN") {
    navigate("/")
    return
  }
  if (!isLoggedIn) {
    console.log(isLoggedIn)
    navigate("/")
    return

  }
  return <Component {...rest} />

};


