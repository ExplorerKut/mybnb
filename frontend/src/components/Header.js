import React,{ useEffect, useState } from 'react';
import {Link,useSearchParams} from 'react-router-dom'
import Popup from './Popup'
import Login from './Popup'
import Search from './Search'
import {SearchWith} from './Search'
function Header({role,setRole,removeRole,token,setToken,removeToken,visibility,setVisibility}){
  // console.log(window.location.pathname)
  // const [currentUrl,setUrl]=useState(window.location.pathname)
 
  const popupCloseHandler=()=>{
    setVisibility(false);
  }
  const visibilitySetter=(e)=> {
    e.preventDefault()
    setVisibility(true)
  }
  let logMeOut=async (e)=>{
    e.preventDefault()
      let response=await fetch("/auth/logout",{
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        }
      }).then(response=>{
        removeToken()
        removeRole()
        setVisibility(false)
        
        return response.json()
      })
    
  }
    return (
      <>
      <div className="header-container sticky">
      <div className="header">
        <div className="header-name">
          <Link to="/" className="link-components"><h1>AirBnB</h1></Link>
        </div>
        <Search/>
        <ul className="menu-options">
        {!token&&token!==""&&token!==undefined?
              <li>
                <a href="#" onClick={visibilitySetter}>
                  SignUp/Login
                </a>
              </li>
        :
          role==="host"?
              <div className="menu-role">
              <Menu removeToken={removeToken} removeRole={removeRole} setVisibility={setVisibility}/>
              </div>
          :
              <div className='menu-role'>
              {/* <li>
                <a href="#" onClick={logMeOut}>
                  Logout
                </a>
              </li>  */}
              <Menu removeToken={removeToken} removeRole={removeRole} setVisibility={setVisibility}/>
              </div>
        }
        </ul>
      </div>
      <div>
        <Popup role={role} removeRole={removeRole} setRole={setRole} token={token} setToken={setToken} removeToken={removeToken} onClose={popupCloseHandler} show={visibility}/>
      </div>
      </div>
      <div>
        {/* <SearchWith isSearchBarVisible={true}/> */}
      </div>
      </>

    );
}
export default Header;
export function Menu(props){
  const [isMenuVisible,setMenu]=useState(false)
  const [role,setRole]=useState(localStorage.getItem("role"))
  const menuVisible=()=>{
    isMenuVisible?setMenu(false):setMenu(true)
  }
  let logMeOut=async (e)=>{
    e.preventDefault()
      let response=await fetch("/auth/logout",{
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        }
      }).then(response=>{
        props.removeToken()
        props.removeRole()
        props.setVisibility(false)
        window.location.reload()
        return response.json()
      })
    
  }
  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={menuVisible} >Menu</button>
      {isMenuVisible
      ?
      role==="host"?
        
        <div className="dropdown-content">
        <li><Link className="link-components" to="/host">RegisterProperty</Link></li>
        <li><Link className="link-components" to="/myBookings">Bookings</Link></li>
        <li><Link className="link-components" to="/registeredProperty">RegisteredProperty</Link></li>
        <li><a href="#" onClick={logMeOut}>Logout</a></li>
        </div>:
        <div className="dropdown-content">
        <li><Link className="link-components" to="/myBookings">Bookings</Link></li>
        <li><Link className="link-components" to="/favourites">Favourites</Link></li>
        <li><a href="#" onClick={logMeOut}>Logout</a></li>
        </div>
        :null
      }
    </div>
  )
}
/* 
<ul className="menu-options">
        {!token&&token!==""&&token!==undefined?
              <li>
                <a href="#" onClick={visibilitySetter}>
                  SignUp/Login
                </a>
              </li>
        :
          role==="host"?
              <div className="menu-role">
              <li>
                <Link to="/host" className='link-components'>Register Property
                </Link>
              </li>
              
              <li>
                <a href="#" onClick={logMeOut}>
                  Logout
                </a>
              </li>
              <Menu/>
              </div>
          :
              <div className='menu-role'>
              <li>
                <a href="#" onClick={logMeOut}>
                  Logout
                </a>
              </li> 
              </div>
        }
        </ul>
*/