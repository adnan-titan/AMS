import React from "react";
import "./index.css"
import titan from './titan.png'
import titanLogo from './titanLogo.svg'
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../useAuth";





const Header = () => {

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleLogout = (e) => {
        localStorage.removeItem("employee_id");
        sessionStorage.removeItem("token");
        console.log(localStorage.getItem("employee_id"));
        console.log(sessionStorage.getItem("token"));
        navigate('/');
        return
    }

    return (
        <header /*className="background-image"*/>
            <div className="header-container">
                <div className="logo ">
                    {/* <img src={titan} alt="Logo" /> */}
                    <img src={titanLogo} alt="Logo" />

                </div>
                <h1 className="text-4xl color: #2d3748 font-bold"
                >Asset Management</h1>
                {isLoggedIn ? (<button onClick={handleLogout}>Log out</button>) : <div />}
            </div>
        </header>
    );
};

export default Header;