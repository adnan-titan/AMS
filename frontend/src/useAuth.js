import { useContext, useEffect, useState } from 'react';
import LoginContext from './utils/LoginContext';

const useAuth = () => {
    console.log('calling useAuth')
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);


    const token = sessionStorage.getItem("token");
    const employee_id = localStorage.getItem("employee_id");
    console.log({ token, employee_id })

    useEffect(() => {

        console.log("useeffect called", { token, employee_id })
        console.log("isconditionTrue ? : ", !!(token && employee_id))
        console.log(token !== null);
        console.log(employee_id !== null);
        if (token !== null && employee_id !== null) {
            console.log("Inside if");
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false)
        }
        console.log({ isLoggedIn })
    }, [window.location.href]);

    console.log("Returning again");
    return { isLoggedIn };
};
export default useAuth;