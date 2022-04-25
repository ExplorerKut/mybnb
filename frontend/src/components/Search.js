import React,{useState, useEffect,useRef} from 'react'
import searchImage from '../images/search (1).png'

import { useSearchParams,useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'
function Search(){
    let navigate=useNavigate()
    const [showSearch,setSearch]=useState(false)
    const [params]=useSearchParams()
    const [height,setHeight]=useState(0)
    const locationValue=useRef()
    const checkin=useRef()
    const checkout=useRef()
    const todayDate=new Date().toISOString().slice(0, 10)
    const setMinimumCheckout=(e)=>{
        if(checkin.current.value!=""){
            e.target.min=checkin.current.value
        }
    }
    useEffect(() => {  
        window.addEventListener("scroll", listenToScroll);
        return () => 
           window.removeEventListener("scroll", listenToScroll); 
      }, [height])
      const showSearchForm=()=>{
          if(showSearch===true){
          setSearch(false)}
          else{setSearch(true)}
      }
      const listenToScroll = () => {
        let heightToHideFrom =10;
        const winScroll = document.body.scrollTop || 
            document.documentElement.scrollTop;
        setHeight(winScroll);
    
        if (winScroll > heightToHideFrom) {  
            
             showSearch && setSearch(false);
             console.log(params)
             if(params.get("location")!=undefined){
                locationValue.current.value=params.get("location");
                }
             if(params.get("checkin")!=undefined){
                checkin.current.value=params.get("checkin");
                
                }
             if(params.get("checkout")!=undefined){
                checkout.current.value=params.get("checkout");
                }
            
                
        } else {
            
             setSearch(true);
        }  
      };
      const handleSubmit=(e)=>{
        e.preventDefault()
        // if(locationValue.current.value!=undefined){
        //     l
        // }
    
        navigate("/locations/search?location="+locationValue.current.value+"&checkin="+checkin.current.value+"&checkout="+checkout.current.value)
        window.location.reload()
      }

    return(
        <>
        { showSearch?
        <div className="search-bar">
            <input className="search-input" type="text" placeholder="Start Your Search" onClick={showSearchForm}readOnly></input>
            <img src={searchImage}/>
        </div>:
        <div className="search-container">
            <form className="location-search" method="get" onSubmit={handleSubmit}>
                <input ref={locationValue} name="location" type="text" placeholder="Location"/>
                <input ref={checkin} name="checkin" type="date" min={todayDate}/>
                <input ref={checkout} name="checkout" type="date" onClick={setMinimumCheckout}/>
                <input type="submit" value="Search"/>
            </form>
        </div>
        }
        </>
    )
}
export default Search;

export function SearchWith(props){
    return(
            <div>
            <form className="location-search">
                <input type="text" placeholder="Location"/>
                <input type="date"/>
                <input type="date"/>
                <input type="submit"></input>
            </form>
            </div>
    )
}