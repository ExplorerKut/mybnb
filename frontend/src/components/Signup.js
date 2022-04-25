import React,{useState,useRef} from "react"
import showPass from '../images/eye.png'
import hidePass from '../images/eyeslash.png'
function Signup({setLogin}){
    const [isValid,setValid]=useState(false)
    // const [isFocused,setFocused]=useState(false)
    const [errorMessage,setStatus]=useState({status:true,"message":""})
    const [isMatching,checkMatching]=useState(false)
    let signup_password=useRef()
    let signup_email=useRef()
    let signup_role=useRef()
    let signup_password_check=useRef()
    // let password_tentative;
    // const password_setter=async (e)=>{
    //     password_tentative= await e.target.value;
    // }
    const check_password=(e)=>{
        // console.log(password_tentative)
        // console.log(e.target.value)
        // console.log(signup_password.current.value)
        if(signup_password_check.current.value===signup_password.current.value){
            checkMatching(true)
        }
        else{
            checkMatching(false)
        }
    }
    let empty=true
    const validator=(e)=>{
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
    const SignMeUp=async (e)=>{
        e.preventDefault()
        if(isMatching){
        let sendData={"email":signup_email.current.value,"password":signup_password.current.value,"role":signup_role.current.value}
        console.log(sendData)
        let response=await fetch("/api/auth/signup",{
            method:"POST",
            headers:{
                "Content-type":"Application/json"
            },
            body:JSON.stringify(sendData)
        }).then(response=>{
            // console.log(response.json())
            return response.json()
        })
        if(response[0].status==="success"){
            setLogin(true)
        }
        else{
            setStatus(({status:false,message:response[0].message}))
        }
        signup_email.current.value=""
        signup_password.current.value=""
        signup_password_check.current.value=""}
        else{
            // signup_email.current.value=""
            signup_password.current.value=""
            signup_password_check.current.value=""
            setStatus(({status:false,message:"Password Not Matching"}))
        }
    }
    return(
        <div>
            <form className="login-form">
                {errorMessage.status?<h3></h3>:<h3>{errorMessage.message}</h3>
                }
                <label htmlFor="email">Email</label>
                <input name="email" type="email" onChange={validator} autoComplete="false" ref={signup_email}></input>
                {
                isValid?<span className="valid"></span>:<span className="invalid">invalid email</span>
                }
                <br></br>
                <label htmlFor="role">Role</label>
                <select name="role" className="signup-role" ref={signup_role}>
                    <option value="User">User</option>
                    <option value="Host">Host</option>
                </select>
                <br></br>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" ref={signup_password}></input>
                <label htmlFor="checkpassword">Repeat Password</label>
                <input name="checkpassword" type="password" onBlur={check_password} ref={signup_password_check} ></input>
                <img  className="eye-icon" src={showPass}/>
                {isMatching?<span>Matched</span>:<span className="invalid">Password Not Matching</span>}
                
                <button type="submit" value="signup" onClick={SignMeUp}>SignUp</button>
                <div className="signup-link">
                <a  onClick={()=>setLogin(true)}>Already Have An Account Login</a>
                </div>
            </form>
        </div>
    )
}

export default Signup;