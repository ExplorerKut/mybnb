import './App.css';
import {useState,useEffect} from 'react'
import {render} from "react-dom"
import { BrowserRouter,Routes, Route} from 'react-router-dom';
import Popup from './components/Popup'
import Header from './components/Header'
import Footer from './components/Footer'
import Content from './components/Content'
import Signup from './components/Signup';
import Bookings from './components/Bookings'
import RequireAuth from './components/RequireAuth'
import Login from './components/Login'
import HostProperty from './components/HostProperty';
import Properties from './components/Properties';
import UseToken from './components/UseToken';
import { AuthProvider } from './context/AuthProvider';
import Booker from './components/Booker';
import UseRole from './components/UseRole'
function App() {
  const {token,removeToken,setToken}=UseToken()
  const [visibility,setVisibility]=useState(false);
  const {role,removeRole,setRole}=UseRole()
  const [currentUrl,setUrl]=useState(window.location.pathname)
  let setterofVisibility=()=>{
    setVisibility(true)
  }
  return (
    <BrowserRouter>
      <>
      <AuthProvider>
      <header className="sticky" >
      <Header currentUrl={currentUrl} removeRole={removeRole} role={role} setRole={setRole}token={token} setToken={setToken} removeToken={removeToken} visibility={visibility} setVisibility={setVisibility}/>
      </header>
      <main>
      <Routes>
      <Route path="/" element={<Content/> }></Route>
      <Route element={<RequireAuth token={token} role={role}/>}>
        <Route path="/host" element={<HostProperty token={token}/>}/>
        <Route path="/myBookings" element={<Bookings token={token}/>}/>
      </Route>
      {/* <RequireAuth path="/host" component={<HostProperty token={token}/>} token={token}/> */}
      <Route path="/places/:locationName" element={<Properties/>}/>
      
      <Route path="/places/:locationName/:locationId" element={<Booker token={token}/>}/>
      <Route path="/host1" element={<HostProperty/>}/>
      </Routes>
      </main>
      <footer><Footer/></footer>
      </AuthProvider>
      </>
      
    </BrowserRouter>
  );
}

export default App;
