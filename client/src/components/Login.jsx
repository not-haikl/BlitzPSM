import React from 'react'
import {useEffect, useState} from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

import logo from "../assets/logo_main_white.png";
import bg_login from "../assets/bg_login.jpg";
import login_illustration from "../assets/login_illustration.svg";
import { client } from '../client';

const Login = () => {
    const [user, setUser] = useState({ });

    const navigate = useNavigate();

    function handleResponse(response){          
        var userObj = jwt_decode(response.credential);
        //console.log(userObj);
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));

        const doc = {
            _id: userObj.sub,
            _type: 'user',
            userName: userObj.name,
            image: userObj.picture,
        }

        client.createIfNotExists(doc).then(() => {
            navigate('/', { replace: true });
        });

        document.getElementById("signInDiv").hidden = true;
        
    }
    
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({             
          client_id: "INSERT_GOOGLE_OAUTH_API_CLIENT_ID",
          callback: handleResponse
        });
    
        google.accounts.id.renderButton(            
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large"}
        )
    
        google.accounts.id.prompt();
    }, [])
  
    return (
        <div className="flex justify-start items-center flex-col h-screen">
        <div className=" relative w-full h-full">
            <img src={bg_login} className="w-full h-full object-cover"/>
  
            <div className="absolute flex justify-center items-center top-0 right-0 left-0 bottom-0 bg-neutral-900/50">
                <div className="p-10 justify-center items-center">
                    <h1>Welcome to</h1>
                <img src={logo} width="620px"/>
                </div>
            
                <div className="justify-center items-center top-0 right-0 left-0 bottom-0">
                    <div className="rounded-t-3xl">
                        <img src={login_illustration} width="520px" className="bg-white rounded-t-3xl p-10"/>
                    </div>  
                    <div className='flex justify-center items-center bg-neutral-600 rounded-b-3xl p-8'>
                        <h2 className='text-white pr-4'>Login using google account:</h2>
                        <div id="signInDiv" className=''></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Login

