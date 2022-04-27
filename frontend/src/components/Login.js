import React,{useState,useRef,useEffect} from "react"
import showPass from '../images/eye.png'
import hidePass from '../images/eyeslash.png'
import Signup from "./Signup"
import useAuth from "../hooks/useAuth"
import {Puff} from 'react-loader-spinner'
import {useNavigate,useLocation} from 'react-router-dom'
function Login({role,visible,setRole,setToken,removeToken,token,setVisibility}){
    const [isValid,setValid]=useState(false)
    const [isLogin,setLogin]=useState(true)
    const [spinnerLoading,setSpinnerLoading]=useState(false)
    const [errorMessage,setStatus]=useState({status:true,"message":""})
    const[login_email,setLoginEmail]=useState("")
    const [user,setUser]=useState()
    // const navigate=useNavigate();
    const {setAuth}=useAuth();
    // const location=useLocation();
    // const from=location.state?.from?.pathname || "/";
    useEffect(()=>{
        setStatus({status:true,"message":" "})
    },[visible])
    // let login_email=useRef()
    let login_password=useRef()
    // const setImage=showPass
    let empty=true
    const validator=(e)=>{
        setLoginEmail(e.target.value)
        empty=false
        let email=e.target.value
        let emailchecker=email.split('@');
        if(emailchecker.length>1){
            emailchecker=emailchecker[1].split('.')
            if(emailchecker.length>=2&&emailchecker[1].length>=3){
                setValid(true)
                
            }
            else{
                setValid(false)
            }
        }
        else{
            setValid(false)
        }
    }
    const logMeIn=async (e)=>{
        e.preventDefault()
        setSpinnerLoading(true)
        if(isValid===false&&login_email===""&&login_password.current.value===""){
            setSpinnerLoading(false)
            console.log("here")
            setStatus({"status":false,"message":"Please check credentials"})
        }
        else{
            
        let sendData={"email":login_email,"password":login_password.current.value}
        // console.log(sendData)
        let response=await fetch("/api/auth/login",{
            method:"POST",
            headers:{
                "Content-type":"Application/json"
            },
            body:JSON.stringify(sendData)
        }).then(response=>{
            return response.json()
        })
        if(response[0].status==="success"){
            const user_email=login_email
            const access_token=response[0].access_token
            // console.log(response[0])
            setSpinnerLoading(false)
            setRole(response[0].role)
            setToken(response[0].access_token)
            setAuth({user_email,access_token})
            setVisibility(false)
            setTimeout(()=>{
                removeToken()
            },60*60*12*1000)
            window.location.reload()
            // navigate(from,{replace:true})
        }
        else{
            setSpinnerLoading(false)
            setStatus(({status:false,message:response[0].message}))
        }
        setLoginEmail("")
        login_password.current.value=""
    }
    }
    return(
        <div>
            <div className="booker-loader">
            <Puff
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    visible={spinnerLoading}
                    // className="loader-style"
            />
            </div>
            {   
                
                isLogin?
                
                <form className="login-form">
                {errorMessage.status?<h3></h3>:<h3>{errorMessage.message}</h3>
                }
                <label htmlFor="email">Email</label>
                <input name="email" value={login_email} type="email" onChange={validator} ></input>
                
                {
                login_email.length>0?isValid?<span className="valid"></span>:<span className="invalid">invalid email</span>:null
                }
                
                
                <br></br>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" ref={login_password}></input>
                <img  className="eye-icon" src={showPass}/>
                
                <button type="submit" value="login" onClick={logMeIn}>Login</button>
                <div className="signup-link">
                <a  onClick={()=>{setLoginEmail("");login_password.current.value="";setLogin(false)}}>Don't Have An Account SignUp</a>
                </div>
            </form>:
            <Signup setLogin={setLogin}/>
            }
        </div>
    )
}

export default Login;