import {useState} from 'react'
function UseRole(){
    const [role,setRole]=useState(getRole())
    function getRole(reqRole){
        const current_role=localStorage.getItem('role')
        // const current_role=reqRole
        return current_role &&current_role
    }
    function saveRole(userRole){
        localStorage.setItem('role',userRole)
        setRole(userRole)
    }
    function removeRole(){
        localStorage.removeItem('role')
        setRole(null)
    }

    return{
        setRole:saveRole,
        role,
        removeRole,
    }
}
export default UseRole