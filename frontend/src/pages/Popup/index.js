
import './index.css'
const PopUp = (props) => {


    return (
        <>
            {
                props.visible && (
                    <div className='popup-wrapper'>
                        <div className="forum-PopUp">
                            <div>
                                <br />

                                <button className='close-button' onClick={() => props.setVisible(false)}>X</button>
                            </div>

                            {props.children}
                        </div>
                    </div>
                )
            }
        </>
    )

}
export default PopUp;
