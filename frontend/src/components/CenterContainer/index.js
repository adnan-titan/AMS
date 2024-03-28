import React from "react";
import "./index.css"
const CenterContainer = (props) => {
    return (
        <div className={`wrapper ${props.className}`}>
            {props.children}
        </div>
    )
}

export default CenterContainer