// this page will accept a users email and password
//create a function which will make a post request with users info in the request body
// success means:
// 1. the user is already registered and  in the database
// 2. response will include a token from the backend that will be placed in the store and sessionstorage
// 3. redirect user to private page

//FAILURE means:
// 1. Response will return a msg of "Bad username or password"   ^^^^^^^^DONE ABIEL
// 2. msg will be displayed on /login page telling the user that the email/password combo does not match

import { useState, useEffect } from "react";
import {useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { UserAccess } from "../components/UserAccess";
import { login } from "../fetch";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {store, dispatch} = useGlobalReducer();

    const handleLogin = () => {
        login(email, password, dispatch)
    }

    //create useEffect to send the user to the /private route when
    //login is successful and a token is received
   useEffect(() => {
    if (store.isLoginsuccessful)
        navigate('/private');
   }
   , [store.isLoginsuccessful])

   
    return (
        <>
        <div className="login-page text-center mt-5">
    
            {
            //create a ternary for the following:
            //check the store fo a valid token
            //if there is a token, welcome the user
            //otherwise, direct the user to the login 
            (store.token && store.token !== undefined && store.token !== "")
                ?
                <>
                
                <h1>Hello! you are logged in.</h1>
                <div>{store.token}</div>
                </>
                :
                <> 
                <UserAccess email={email} password={password} setEmail={setEmail} setPassword={setPassword} />
                 </>
            }
        
             </div>
        </>
    );
}



