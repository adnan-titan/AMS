import React from 'react'
import home from './home.png'
import { useNavigate } from 'react-router-dom'
import './index.css';
const HomeButton = () => {
    const navigate = useNavigate();
    const handleOnImageClick = (e) => {

        navigate("/userView");

    }
    return (
        <div >
            <div>
                <img className='image-position' onClick={(e) => handleOnImageClick(e)}
                    src={home} width="35" height="60" padding="30px" alt="Home" />
                <button className='button-home' onClick={(e) => handleOnImageClick(e)}>Home</button>
            </div>
        </div>
    )
}

export default HomeButton