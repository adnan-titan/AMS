import React from 'react'
import styles from './index.module.css'
const TextField = (props) => {
    const { className, showError, label, errorLabel, ...rest } = props
    return (
        <div className={className}>
            <label>{label}</label>
            <input {...rest} className='field-value-radius' />
            {errorLabel && showError
                ?
                (<div className={styles['errLabel']}>{errorLabel}</div>)
                :
                <div className={styles['emptyDiv']}></div>
            }
        </div>
    )
}
export default TextField