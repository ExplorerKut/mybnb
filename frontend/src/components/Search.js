import React,{useState, useEffect,useRef} from 'react'
import searchImage from '../images/search (1).png'
import { useSearchParams } from 'react-router-dom'
import ReactDOM, { unstable_renderSubtreeIntoContainer } from 'react-dom'
function Search(){
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
      const listenToScroll = () => {
        let heightToHideFrom =10;
        const winScroll = document.body.scrollTop || 
            document.documentElement.scrollTop;
        setHeight(winScroll);
    
        if (winScroll > heightToHideFrom) {  
            
             showSearch && setSearch(false);
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

    return(
        <>
        { showSearch?
        <div className="search-bar">
            <input className="search-input" type="text" placeholder="Start Your Search" readOnly></input>
            <img src={searchImage}/>
        </div>:
        <div>
            <form action="/locations/search" className="location-search" method="get">
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