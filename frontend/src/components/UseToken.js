import {useState} from 'react'
function UseToken(){
    const [token,setToken]=useState(getToken())

    function getToken(){
        const userToken=localStorage.getItem('token')
        return userToken && userToken 
    }
    function saveToken(userToken){
        localStorage.setItem('token',userToken);
        setToken(userToken)
    }
    function removeToken(){
        localStorage.removeItem("token")
        setToken(null)
    }
    return{
        setToken: saveToken,
        token,
        removeToken,
    }
}
export default UseToken