import React from "react";
import TextField from "../TextField";
import _ from 'lodash';
import styles from "./index.module.css"
import CloseIcon from './close.svg'

const TextFieldOrSelect = (props) => {
    console.log({ props })

    return (
        <div style={{ minWidth: "50%" }}>

            {
                props.showTextField ?
                    <div style={{ display: 'flex' }}>
                        <TextField label={props.label} className={styles["text-input"]} onChange={props.onChange} />
                        <button style={{ height: '30px', marginTop: "33px" }} onClick={() => props.setFormData(prev => ({ ...prev, [props.keyName]: props.options[0] }))}> <img src={CloseIcon} width="30" height="30" padding="30px" alt="Cross" /></button>

                    </div> :
                    <>
                        <h4 className={styles["h4"]}> {props.label}</h4>
                        <div style={{ display: 'flex' }}>
                            <select className={styles.dropdown} onChange={props.onChange} >
                                {props.options.map(opt => <option value={opt}>{opt}</option>)}
                            </select>

                        </div>
                    </>
            }



        </div>
    )
}

export default TextFieldOrSelect